# Community Showcase

**Date:** 2026-06-12
**Branch:** fresh branch off `main` (e.g. `showcase`)
**Status:** Approved — ready for implementation plan
**Decision record:** [`docs/adr/0008`](../../adr/0008-showcase-google-sheet-datastore-and-auto-moderation.md)
**Vocabulary:** Showcase, Submission, Submit, Examples, Maker — defined in [`CONTEXT.md`](../../../CONTEXT.md)

## Problem / Goal

Makers (the maintainer's students — "ninjas") love the app and want their work seen. Today a finished sprite leaves the app silently via Export/Copy and is never seen again. We want a **Showcase**: a home-page grid of recent community **Submissions** that fills *live* as a classroom submits, giving makers the "I made this and it's on the real website, right now" thrill.

Hard constraints (self-funded project): **$0 to run, no real database, minimal manual effort.** A Submission must be effortless for a kid — the sprite and prompt are already in the app, so they should only type a name and a title.

## Scope

Full-stack, but small in each layer:

- **`shared/`** — new wire schemas for Submit (request) and a public Showcase entry (read).
- **`server/`** — one new route pair (submit + read), an Apps Script client with a read cache, a moderation extension, and two config vars.
- **`client/`** — a **Submit modal** in the studio (triggered from the Export/Copy flow) and a **Showcase section** + realized **Examples section** on the home page, sharing one sprite-grid component.
- **Out of band (maintainer):** create a Google Sheet, deploy the bundled Apps Script, set two server env vars. The feature is inert until this exists.

Not in scope: the motion redesign (separate, client-only effort that also touches `HeroPage` — see *Branch strategy & coupling*), accounts/auth, a permanent hall-of-fame, SSE/real-time push, a client test suite.

## Architecture overview

```
STUDENT (studio)                 SERVER (Hono)                 GOOGLE                 VISITORS (home page)
────────────────                 ─────────────                 ──────                 ────────────────────
Copy img-literal                                                                      Showcase section
   │ (modal auto-opens                                                                   │ polls every ~15s
   │  every Copy)                                                                        ▼
Submit {name,title,       POST /showcase/submit                                     GET /showcase
 prompt?,imgLiteral,  ──►  • validate (Zod 422)                                          │
 w,h,palette,             • moderate name+title (text)                              server cache (~15s)
 imageDataUrl}            • moderate image (omni, upscaled)                              │ on miss:
                          • dedupe by imgLiteral            doPost(token) ──►  Sheet ◄── doGet
                          • append + roll cap (≤18)              │            (≤18 rows)    │
                          ◄─────────────────────────────────────┘                          ▼
   ◄── ok / friendly error                                                          3×4 grid (12) +
        (Copy already succeeded)              MAINTAINER: delete a row to remove    "Be the first" tiles
```

The studio never talks to Google; the browser never talks to Google. The Hono server is the only thing that knows the Apps Script URL + token.

## The Google Sheet + Apps Script (the datastore)

A single sheet `Submissions` with columns:

`Timestamp · Name · Title · Prompt · ImgLiteral · Width · Height · Palette`

No "Approved" column — Submissions are live by default (auto-published); **deleting a row removes it** from the Showcase within one cache cycle.

A bound Apps Script web app (deployed "Anyone", run as the maintainer) exposes:

- **`doPost(e)`** — verify `e` carries the shared secret token; append a row from the JSON body; if the sheet now exceeds the rolling cap (18 data rows), delete the oldest extras. Return `{ ok }` JSON.
- **`doGet(e)`** — return the rows mapped to public **Showcase entries** (Name, Title, ImgLiteral, Width, Height, Palette — **never Prompt**), newest-first. Return `{ entries }` JSON.

The script body + a step-by-step deploy guide ship as an implementation artifact (e.g. `server/google-apps-script/Showcase.gs` + README). Apps Script web apps always return HTTP 200; success/failure is conveyed in the JSON body.

## Wire contract (`shared/src/wire.ts`)

Following the existing Request/Response + `z.infer` convention:

```ts
export const ShowcaseSubmitRequestSchema = z.object({
  name:        z.string().min(1).max(24),
  title:       z.string().min(1).max(40),
  prompt:      z.string().max(500).optional(),   // absent for hand-drawn/uploaded
  imgLiteral:  z.string().max(8000),             // ample for up to ~64×64
  width:       z.number().int().positive(),
  height:      z.number().int().positive(),
  palette:     MakeCodePaletteSchema,
  imageDataUrl: z.string().startsWith("data:image/"), // moderation only — NOT stored
});
export type ShowcaseSubmitRequest = z.infer<typeof ShowcaseSubmitRequestSchema>;

export const ShowcaseEntrySchema = ShowcaseSubmitRequestSchema.omit({
  prompt: true, imageDataUrl: true,              // public, prompt stays private
});
export type ShowcaseEntry = z.infer<typeof ShowcaseEntrySchema>;

export const ShowcaseResponseSchema = z.object({ entries: z.array(ShowcaseEntrySchema) });
export type ShowcaseResponse = z.infer<typeof ShowcaseResponseSchema>;
```

`imageDataUrl` is used only to moderate the image and is never stored or returned.

## Server design (`server/src/`)

- **`config.ts`** — add `APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`.
- **`showcase.ts`** (new) — `submitToSheet(entry)` (POST to Apps Script with the token) and `fetchShowcase()` (GET from Apps Script) wrapped in a **~15s in-memory cache** (single shared cache; many client polls → at most one Google read per ~15s). Pure helpers (rolling-window math, dedupe predicate) split out for unit tests.
- **`openai.ts`** — add `moderateImage(dataUrl)` calling `omni-moderation-latest` with image input, mirroring the existing `moderatePrompt`.
- **`moderation-logic.ts`** — add a pure `showcaseModerationVerdict(...)` that combines OpenAI's `flagged` with **kid-stricter category thresholds** (sexual, sexual/minors, hate, self-harm, violence). Unit-tested independently, like `applyModerationOverride`.
- **`app.ts`** — two routes:
  - `POST /showcase/submit` — `safeParse` → 422 on bad body; moderate name+title; moderate (upscaled) image; reject with a kind, vague reason on either; dedupe by `imgLiteral` against the current window (return "already in" rather than a duplicate); `submitToSheet`; light in-memory rate limit (e.g. 5/min per IP).
  - `GET /showcase` — return cached `fetchShowcase()` as `ShowcaseResponse`.
- **`index.ts`** — unchanged.

## Client design (`client/src/`)

- **Shared grid:** one `SpriteGrid` + `SpriteTile` component. A tile renders a `ShowcaseEntry` to a `<canvas>` via the existing `drawSpriteDataOnCanvasTransparent` (parse the stored img-literal to `MakeCodeColor[][]`), `image-rendering: pixelated`, with a caption `"{title}" — by {name}`. Used by **both** the Showcase and the Examples sections (the "identical styling" decision).
- **Submit modal (studio):** opens automatically after a **successful Copy** in the Export flow (every Copy). Pre-fills the sprite preview and silently captures the prompt (`OpenAISettingsContext`) for AI sprites. Two fields: **Name** ("First name or nickname", with a visible "shown publicly — never your full name" notice) and **Title**. Client-side `bad-words` pre-filter on both for instant feedback. On submit: call `POST /showcase/submit`; on success show "🎉 On the wall!" and **optimistically insert** the entry into the local Showcase store so the submitter sees it instantly. If this exact sprite is already in the window, show "Already in the Showcase ✓" instead of submitting.
- **Showcase section (home page):** a 3×4 grid (12 shown) placed **just under the hero**. Polls `GET /showcase` every ~15s (only while the tab is visible) and renders newest-first from the ~18-row window. A **`localStorage` stale-while-revalidate cache** paints the last-seen grid instantly on load (covers Render cold-start). **Honest empty state:** when fewer than 12 real entries, fill remaining cells with a "Your sprite could be here →" tile — no fake filler, no seeding.
- **Examples section (home page):** realize the existing `ExampleGallery` by feeding it curated `ShowcaseEntry`-shaped sprites from a baked TypeScript module (`client/src/.../exampleSprites.ts`, maintainer-edited). Same `SpriteGrid`. Sits lower in the page (its motion-redesign Phase-3 slot). On `main` this component currently renders placeholder squares, so this swap also touches it — the convergence point with the redesign.
- **API:** `api/submitShowcase.ts`, `api/fetchShowcase.ts` against `VITE_API_URL`. No new client env var; the Apps Script URL is server-only.

## Data model & rolling window

Store the **18 most recent** Submissions (12 shown + ~6 deletion buffer). New Submission → prepended → oldest beyond 18 rolls off (enforced in `doPost`). Recency order; no random sampling (the window is small enough that "recent" and "all" converge). Deletion = removal.

## Moderation (stricter for kids)

At Submit: name + title (text) and the rendered sprite image (upscaled ~512px nearest-neighbor, client-rendered into `imageDataUrl`) both go through free `omni-moderation`. Reject on OpenAI's `flagged` **or** any kid-sensitive category over a low custom threshold. The prompt is not re-moderated (private; already moderated at generation for AI sprites). **Residual risk is explicitly accepted** (pixel-art + no OCR) — see ADR 0008 consequences; backstops are the rolling window and one-click deletion.

## Failure handling

**Copy and Submit are fully decoupled** — the clipboard Copy that opened the modal has already succeeded; nothing here ever blocks or undoes it. Friendly modal states: moderation rejection (kind + vague: "Let's keep it school-appropriate — try a different name, title, or sprite"), rate-limited ("One sec — try again in a moment"), server/Apps Script unreachable ("Couldn't reach the Showcase — your sprite is still copied!"), duplicate ("Already in the Showcase ✓").

## Safety (minors, public)

First-name/nickname only with a public-exposure notice; no last names, school, or class collected. Title + name + sprite are the only public fields; the prompt is private to the sheet. Auto-publish is gated by stricter AI moderation; the maintainer can delete any row instantly, and the rolling window means nothing lingers.

## Security & abuse

Apps Script URL + token are server-only; `doPost` rejects any call without the token, so the public can't write even though reads are proxied. Light per-IP rate limit on `/showcase/submit`. The server read cache bounds Google quota regardless of open-tab count.

## Branch strategy & coupling

Built on a **fresh branch off `main`**. Known coupling: the **motion redesign** (separate, approved, not-yet-implemented spec) also rewrites `HeroPage` and its `ExampleGallery`. Whichever lands second rebases the home-page composition; the near-hero Showcase placement is the coordination point. The Showcase's Examples section is the same component the redesign's Phase 3 populates — they should converge on one curated source.

## Phasing

Each phase is independently shippable.

1. **Contract + server + Sheet.** Add schemas; build `/showcase/submit` + `/showcase`, moderation extension, Apps Script client + cache; deploy the Sheet/script; verify end-to-end with curl. No UI yet.
2. **Submit flow.** Submit modal in the studio off the Copy action, with moderation errors, dedupe, optimistic insert.
3. **Showcase section.** `SpriteGrid`/`SpriteTile`, the near-hero live grid with polling, SWR cache, and honest empty state.
4. **Examples section.** Feed curated sprites into `ExampleGallery` via the shared grid.

## Testing

- **Server (Bun `bun test`):** `/showcase/submit` — 422 on bad body, text rejection, image rejection (moderation mocked), dedupe, happy-path append (Apps Script `fetch` mocked), rate limit; `/showcase` — cached read (Apps Script mocked, asserts ≤1 upstream call across N requests in the window); `moderation-logic` strict-threshold unit tests.
- **Client:** no suite exists — verify in the browser preview: modal opens on Copy, moderation rejection messaging, optimistic insert, grid render + `pixelated`, honest empty state, live update across two tabs.

## Edge cases & notes

- **Img-literal round-trip:** store and parse with matching serializer/parser; the gallery render must reconstruct `MakeCodeColor[][]` from the stored literal (confirm/extend the existing serialize path).
- **Img-literal size cap:** the schema's `imgLiteral` max (drafted at 8000, ~64×64) must be confirmed against the editor's actual maximum canvas size during implementation, so legitimate large sprites aren't rejected at the 422.
- **Palette fidelity:** the palette is stored per Submission so non-default palettes render correctly in the grid.
- **Blank/empty sprite:** block Submit on an all-transparent canvas.
- **Cold start:** the home page renders instantly (empty-state grid + SWR cache); the grid fills when the server responds — never a blank/broken section.
- **Prompt presence:** optional; hand-drawn/uploaded Submissions carry no prompt.

## Out of scope

Accounts/auth, permanent featured tab, random sampling from a large pool, SSE/WebSocket push, the motion redesign itself, a client test suite, server-side image rendering (the client supplies `imageDataUrl`).

## Open risks

1. **Pixel-art moderation reliability** — accepted; mitigated by upscaling + rolling window + manual delete.
2. **Render cold-start on the read path** — mitigated by SWR cache + honest empty state.
3. **HeroPage merge coordination** with the pending motion redesign (off-main branch choice).
4. **Apps Script latency/quota** — bounded by the server read cache; submit latency includes one Google round-trip.
