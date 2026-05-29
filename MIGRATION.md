# Bun Migration Plan

Migrating the MakeCode Arcade Sprite Generator from (React+Vite client / FastAPI+Python server)
to an all-Bun, all-TypeScript monorepo with unified types and Docker-based deploys on Render.

This is a **live, ad-supported app with no test suite**, so the plan is a sequence of small,
independently shippable PRs — **not a big-bang migration branch**. `main` stays deployable throughout.

See `docs/adr/` for the decisions behind this plan (ADR-0001 … ADR-0005).

## Target shape

```
/
├── docker-compose.yml          # local: `docker compose up` brings up client + api
├── render.yaml                 # prod IaC: two Docker web services on Render
├── package.json                # Bun workspaces: client, server, shared
├── shared/                     # @makespritecode/shared — Zod schemas + inferred types (raw TS, no build)
├── client/                     # React 19, Bun bundler (no Vite), Dockerfile (Bun static server)
└── server/                     # Hono on Bun, Dockerfile
```

## Sequence

Each numbered item is its own PR. ✅ = independently shippable to production.

1. **Bun package manager + workspaces** — root `package.json` workspaces (`client`/`server`/`shared`),
   `bun install`, drop `concurrently`. Keep Vite. Delete Poetry artifacts only after step 5. No behavior change. ✅
2. **Replace Vite with Bun's bundler** + convert `client/src/index.scss` → plain CSS (native nesting +
   two CSS custom properties). **Risky moment #1** — isolate so a visual regression rolls back just this. ✅
3. **`shared/` Zod package; client imports from it** — define the wire contract once (request/response
   schemas + cross-wire enums), delete the client's duplicated types. Keep UI catalogs (`ALL_*`, palette
   colour maps, `EditorTools`) in the client. Python backend untouched — its Pydantic is the last duplicate. ✅
4. **Characterization fixtures** — *before* touching the backend, capture real request→response pairs for
   all three endpoints (`/generate-image/pixellab`, `/generate-image/openai`, `/moderation/moderate`) plus
   a few sample generated images. With no test suite, these are the only oracle for behavior parity.
5. **Bun/Hono backend rewrite** — port the 3 endpoints, 2 prompt builders, and the size math
   (`get_final_size` for both providers); validate request bodies with the shared Zod schemas; OpenAI via
   the JS SDK; PixelLab via `fetch` to `https://api.pixellab.ai/v1`; **drop the no-op Pillow re-encode**.
   Add `server/Dockerfile` and Bun tests against step 4's fixtures. **Risky moment #2.**
6. **Cutover** — deploy the Bun API as a **new, separate Render service** (new URL); smoke-test against
   step-4 fixtures + manual generation; flip the client's `VITE_API_URL` and deploy the frontend.
   **Keep the Python service warm** so rollback is an env-var flip (seconds). Decommission Python only
   after a few stable days.
7. **Containerize the frontend + `docker-compose.yml` + `render.yaml`; remove Python.** ✅

## Cleanup folded into the rewrite

- **Env var naming is inconsistent today**: the README documents `PIXELLAB_API_TOKEN` / `OPENAI_API_TOKEN`,
  but the code and `.env` use `PIXELLAB_API_KEY` / `OPENAI_API_KEY`. Standardize on `*_API_KEY` (matches the
  running config) and fix the README during step 5/6.
- The in-progress Python cleanup ("Organized schemas/types", "Removed static file code", `__pycache__`
  hygiene) is throwaway *code* but a valid *blueprint*: port the schema/enum/request structure into the
  Zod schemas; the static-serving removal already aligns with the two-service split (ADR-0004).

## Risk notes

- Two genuinely hard-to-undo moments: the Vite swap (step 2) and the backend cutover (step 6). Both are
  isolated to their own PR with a clean rollback path.
- `docker-compose.yml` is **local-only** — Render builds each Dockerfile independently (declared in
  `render.yaml`). The compose file and `render.yaml` describe the same two services and must stay in sync.
