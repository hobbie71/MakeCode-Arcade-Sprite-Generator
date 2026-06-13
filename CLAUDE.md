# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An AI-enhanced sprite generator/editor for **MakeCode Arcade**. Users convert images or text prompts into pixel-art sprites and export them as PNG, JavaScript, Python, or MakeCode `img` image-literal paste format. Live at makespritecode.com (deployed on Render.com).

## Monorepo layout

Bun workspaces (`workspaces` in root `package.json`) — three packages, one toolchain (install, run, bundle, test are all Bun):

- **`client/`** — React 19 + TypeScript SPA, Tailwind CSS 3, bundled by **Bun's bundler (not Vite — see Toolchain gotchas)**.
- **`server/`** — Hono API on Bun (TypeScript). Calls OpenAI for image generation and moderation.
- **`shared/`** (`@makespritecode/shared`) — Zod schemas defining the client↔server wire contract.

## Commands

Run from the repo root unless noted.

```bash
bun install                          # install all workspaces
bun run dev                          # client + server together (filters all workspaces' dev script)
bun run dev:client                   # client only
bun run dev:server                   # server only (dev script overrides PORT to 62274)

# Server (cd server, or use --filter server)
bun test                             # run server tests (Bun's built-in test runner)
bun test src/size.test.ts            # run a single test file
bun run --filter server typecheck    # tsc --noEmit

# Client (cd client, or use --filter client)
bun run --filter client build        # css:build + tsc -b + build.ts + copy public/ → dist/
bun run --filter client lint         # eslint
bun run --filter client test         # bun:test under happy-dom + RTL (harness ready; no client specs yet)
bun run --filter client typecheck    # tsc -b
bun run --filter client start        # serve the built dist/ statically

# All workspaces at once (this is what CI runs)
bun run test                         # fans out to every workspace's test script
bun run typecheck                    # client tsc -b + server tsc --noEmit

docker compose up                    # bring up both containerized services locally
```

Server and shared have `*.test.ts` suites that run plain `bun:test` next to source. The **client test suite was removed in the UI redesign** — those specs targeted the pre-redesign components — and is to be rebuilt for the new UI. The harness, however, is still wired up: happy-dom registers DOM globals via `client/happydom.ts`, RTL's `afterEach(cleanup)` via `client/test-setup.ts`, both through `client/bunfig.toml`'s `[test].preload`, with shared render helpers (`renderWithProviders`, `renderHookWithProviders`) in `client/src/test/test-utils.tsx`. So `bun run --filter client test` passes green with no specs yet, and new `*.test.tsx` files can be dropped in beside their components. Client test files are **excluded from the production `tsc -b` build** (see the `exclude` in `client/tsconfig.app.json`). GitHub Actions runs the suite + typecheck on every pull request (`.github/workflows/test.yml`).

## Architecture — the big picture

**Single source of truth for the wire contract (ADR-0002).** Request/response shapes and the enums whose string values cross the network live **once** as Zod schemas in `shared/src/` (`wire.ts`, `enums.ts`, `palette.ts`, re-exported from `index.ts`). The client derives static types with `z.infer`; the server validates incoming bodies with the *same* schemas via `safeParse`, returning a clean 422 before spending a paid OpenAI call. When you change the API contract, edit `shared/` — never hand-mirror types in client and server. The package is raw TS with no build step (`exports` points straight at `./src/index.ts`).

Critical boundary: **only the wire contract belongs in `shared/`.** UI-only metadata stays in the client — the `ALL_*` label arrays, palette colour maps (`ArcadePalette`, etc.), and `EditorTools`. The palette crosses the wire as a generic `Record<string,string>`, so only the *type* `MakeCodePalette` is shared, not the palette data. Keep React/UI concerns out of `shared/` (they would leak into the server's dependency graph).

**Server (`server/src/`).** `index.ts` exports a Bun server default (`{ port, hostname, fetch: app.fetch }`); the Hono app is in `app.ts`. Three routes:

- `GET /` — version/info JSON.
- `POST /generate-image/openai` — body `OpenAISpriteRequest` (`{ settings: { prompt, assetType }, size: { width, height }, palette }`) → `{ image_data, width, height }`, where `image_data` is a `data:image/png;base64,...` URL the client renders directly. Generation quality is forced to `"low"` server-side (Medium/High were removed — no longer offered in the UI or carried on the wire).
- `POST /moderation/moderate` — body `{ prompt }` → `{ is_appropriate, flagged, categories, category_scores }`.

Supporting modules: `openai.ts` (`generateOpenAISprite`, `moderatePrompt` — the OpenAI calls), `moderation-logic.ts` (`applyModerationOverride`, pure logic that adjusts OpenAI's raw moderation verdict — unit-tested independently of the network), `prompt.ts` (prompt construction), `size.ts` (sprite sizing), `config.ts` (env parsing). The generation flow is **moderate-then-generate**: the client checks a prompt before triggering a paid image call.

**Client (`client/src/`).** Heavy use of React Context — one provider per concern under `context/` (`SpriteContext`, `CanvasContext`, `PaletteSelectedContext`, `OpenAISettingsContext`, `GenerationMethodContext`, `AssetTypeContext`, etc.), all composed in `providers/AppProviders.tsx`. Feature folders under `features/`: `InputSection` (prompt/image input + generation) and `SpriteEditor` (a full pixel-art editor with its own components/contexts/hooks/libs/Sidebar); sprite export (MakeCode `img` copy + image downloads) lives in `pages/StudioPage/modals/ExportModal.tsx` on top of `useExportSpriteData`. Network calls go through `api/` (`generateImageApi.ts`, `moderatePrompt.ts`) against the base URL from `VITE_API_URL`. Profanity is pre-filtered client-side with `bad-words` before hitting the moderation endpoint.

## Toolchain gotchas

- **Bun's bundler replaced Vite (ADR-0003).** There is no Vite config. The client build is `client/build.ts` (a `bun build` script) plus `client/external-public.plugin.ts` (a Bun plugin) and `client/serve.ts`; the HTML entry is `client/index.html`; Bun-specific settings are in `client/bunfig.toml`. Tailwind is compiled separately by the `css:build`/`css:dev` scripts into `src/tailwind.gen.css` (**generated — don't edit**). CSS must be plain CSS, not Sass — Bun's lightningcss bundler does not process `.scss`.
- **Python is fully gone.** The backend was migrated from FastAPI/Python to Hono/Bun, and the dead Python artifacts (the old `server/app/` FastAPI source tree, `server/.venv/`, and the root `.venv/`) were deleted 2026-06-13. The live server is entirely under `server/src/`. A few source comments still reference the Python originals (e.g. "parity with the FastAPI ..."). PixelLab and background-removal features from the old backend were dropped (OpenAI-only now).

## Deployment (Render.com)

Two **decoupled** Docker services (ADR-0004, ADR-0005), defined as code in `render.yaml`, both on Bun:

- **Client** — built to static `dist/`, served with `serve -s dist` (`client/Dockerfile`).
- **API** — `bun src/index.ts` (`server/Dockerfile`).

The split lets them version and roll back independently; cutover/rollback is done by re-pointing the client's build-time `VITE_API_URL`.

**Environment variables.** API: `OPENAI_API_KEY`, `CORS_ORIGINS` (a JSON-array literal *or* comma-separated list — see `parseCorsOrigins` in `config.ts`), `ENVIRONMENT`, `PORT` (defaults to 8000), `HOST`, `DEBUG`. Client (**build-time**, inlined into the bundle — must be present at build, not runtime): `VITE_API_URL`, `VITE_GOOGLE_AD_CLIENT_ID`, `VITE_SQUARE_AD_SLOT_ID`. Copy `.env.example` → `.env` in both `client/` and `server/` for local dev.

## Decisions

Architecture decisions are recorded in `docs/adr/` (0001 backend in Bun/TS with Hono, 0002 shared Zod schemas, 0003 Bun bundler over Vite, 0004 two decoupled services, 0005 containerization). Read the relevant ADR before reworking the toolchain, the wire contract, or the deployment topology — each records *why* a non-obvious choice was made.
