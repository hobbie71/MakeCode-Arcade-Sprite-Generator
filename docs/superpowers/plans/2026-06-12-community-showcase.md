# Community Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a home-page grid of community-submitted sprites ("Showcase") that fills live, where makers Submit straight from the studio's Copy flow, stored in a Google Sheet via Apps Script and auto-published after free AI moderation.

**Architecture:** Studio Submit modal → `POST /showcase/submit` (Hono: validate → moderate name/title + image → dedupe → append to Sheet via a token-gated Apps Script web app, which keeps only the 18 newest rows). Home page polls `GET /showcase` (server-cached ~15s read of the Sheet) and renders img-literals to `<canvas>`. The browser and studio never touch Google; the Apps Script URL + token are server-only.

**Tech Stack:** Bun + Hono (server), React 19 + TypeScript + Tailwind (client), Zod (shared wire contract), Google Apps Script (datastore), OpenAI `omni-moderation-latest` (free text + image moderation), `bad-words` (client pre-filter).

**Spec:** `docs/superpowers/specs/2026-06-12-community-showcase-design.md` · **ADR:** `docs/adr/0008-showcase-google-sheet-datastore-and-auto-moderation.md` · **Glossary:** `CONTEXT.md`

---

## Conventions discovered (follow these exactly)

- **Shared schemas** (`shared/src/wire.ts`): `import { z } from "zod"`; `export const XSchema = z.object({...})` then `export type X = z.infer<typeof XSchema>`. `index.ts` already does `export * from "./wire"`, so no index edit needed. Palette type: `MakeCodePaletteSchema = z.record(z.string(), z.string())`.
- **Server routes** (`server/src/app.ts`): `const parsed = Schema.safeParse(await c.req.json().catch(() => null)); if (!parsed.success) return c.json({ success: false, error: "Invalid request", detail: parsed.error.issues }, 422);` then `return c.json(result)`.
- **Server tests** (`bun:test`): `app.request(path, {...})` for routes; **no mocking library** — tests only exercise validation/routing (never reach OpenAI/network) and call pure functions with inline/fixture data. Design pure helpers so logic is testable offline.
- **Config** (`server/src/config.ts`): plain object literal, `process.env.X ?? default`.
- **Client API** (`client/src/api/*.ts`): `fetch(URL, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(...) }); if (!response.ok) throw new Error(...); return response.json();` URLs from `client/src/constants/api.ts` built off `process.env.VITE_API_URL || "http://localhost:62274"`.
- **Client state**: React Context only (no zustand). Factory: `createStateContext<T>(initial)` from `client/src/context/createStateContext.tsx` returns `{ Context, Provider }` exposing `{ value, setValue }`; a sibling `useX.ts` consumes it with an undefined-guard.
- **Img-literal**: store with `regionToImgLiteral(spriteData)` (`client/src/features/SpriteEditor/libs/serializeSpriteRegion.ts`); render by parsing with `parseMakeCodeSprite(text)` (`client/src/utils/makeCodeSpriteValidation.ts`) → `MakeCodeColor[][]`, then `drawSpriteDataOnCanvasTransparent(canvas, {x:0,y:0}, data, palette, pixelSize, 1)` (`client/src/features/SpriteEditor/libs/drawPixelOnCanvas.ts`). Round-trip is proven (clipboard copy/paste, ADR-0007).
- **Profanity**: `import { Filter } from "bad-words"; new Filter().isProfane(text)` (already used in `client/src/features/InputSection/utils/promptModeration.ts`).

---

## Task 1: Create the branch and land the design docs

**Files:**
- Branch: `showcase` (off `main`)
- The design docs from the brainstorming session (`CONTEXT.md` additions, `docs/adr/0008-...md`, `docs/superpowers/specs/2026-06-12-community-showcase-design.md`, this plan) should be committed first.

- [ ] **Step 1: Create the branch off main**

```bash
cd /Users/javiertamayo/Documents/Coding/makecode-arcade-sprite-generator
git stash --include-untracked            # if design docs are uncommitted in the working tree
git checkout main
git checkout -b showcase
git stash pop                            # restore the design docs onto the new branch (skip if not stashed)
```

If the design docs are NOT present in the working tree (fresh checkout), they exist in the brainstorming session's history — re-create them from the spec/ADR before continuing, or proceed and treat the spec text in this repo as the source of truth.

- [ ] **Step 2: Commit the design docs**

```bash
git add CONTEXT.md docs/adr/0008-showcase-google-sheet-datastore-and-auto-moderation.md docs/superpowers/specs/2026-06-12-community-showcase-design.md docs/superpowers/plans/2026-06-12-community-showcase.md
git commit -m "docs: community Showcase spec, ADR 0008, plan, and glossary terms"
```

---

## Task 2: Add the wire contract (shared)

**Files:**
- Modify: `shared/src/wire.ts` (append at end)

- [ ] **Step 1: Add the three schemas**

Append to `shared/src/wire.ts` (it already has `import { z } from "zod";` at the top and imports `MakeCodePaletteSchema`):

```typescript
// --- Community Showcase (ADR-0008) -----------------------------------------

// What the studio POSTs to /showcase/submit. `imageDataUrl` is a client-rendered
// PNG used ONLY for image moderation — it is never stored or returned.
// `imgLiteral` max is sized for MakeCode's 128x128 ceiling (~16.6k chars no-space).
export const ShowcaseSubmitRequestSchema = z.object({
  name: z.string().min(1).max(24),
  title: z.string().min(1).max(40),
  prompt: z.string().max(500).optional(),
  imgLiteral: z.string().min(1).max(20000),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  palette: MakeCodePaletteSchema,
  imageDataUrl: z.string().startsWith("data:image/"),
});
export type ShowcaseSubmitRequest = z.infer<typeof ShowcaseSubmitRequestSchema>;

// One public Showcase entry (what /showcase returns). No prompt, no imageDataUrl.
export const ShowcaseEntrySchema = ShowcaseSubmitRequestSchema.omit({
  prompt: true,
  imageDataUrl: true,
});
export type ShowcaseEntry = z.infer<typeof ShowcaseEntrySchema>;

export const ShowcaseResponseSchema = z.object({
  entries: z.array(ShowcaseEntrySchema),
});
export type ShowcaseResponse = z.infer<typeof ShowcaseResponseSchema>;
```

- [ ] **Step 2: Typecheck shared via the server (which imports it)**

Run: `bun run --filter server typecheck`
Expected: PASS (no type errors).

- [ ] **Step 3: Commit**

```bash
git add shared/src/wire.ts
git commit -m "feat(shared): add Showcase submit/entry/response wire schemas"
```

---

## Task 3: Showcase moderation thresholds (server, pure, TDD)

**Files:**
- Modify: `server/src/moderation-logic.ts`
- Test: `server/src/moderation-logic.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `server/src/moderation-logic.test.ts`:

```typescript
import { isShowcaseContentFlagged } from "./moderation-logic";

describe("isShowcaseContentFlagged (kid-stricter Showcase gate)", () => {
  const clean = { flagged: false, categories: {}, category_scores: {} };

  test("clean content passes", () => {
    expect(isShowcaseContentFlagged(clean)).toBe(false);
  });

  test("OpenAI's own flagged=true always blocks", () => {
    expect(isShowcaseContentFlagged({ ...clean, flagged: true })).toBe(true);
  });

  test("sexual score over the strict threshold blocks even when flagged=false", () => {
    expect(
      isShowcaseContentFlagged({ ...clean, category_scores: { sexual: 0.3 } }),
    ).toBe(true);
  });

  test("sexual/minors is the strictest (0.05) and blocks at a low score", () => {
    expect(
      isShowcaseContentFlagged({ ...clean, category_scores: { "sexual/minors": 0.06 } }),
    ).toBe(true);
  });

  test("a low violence score under the strict threshold passes", () => {
    expect(
      isShowcaseContentFlagged({ ...clean, category_scores: { violence: 0.1 } }),
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd server && bun test src/moderation-logic.test.ts`
Expected: FAIL — `isShowcaseContentFlagged is not a function` / import error.

- [ ] **Step 3: Implement**

Append to `server/src/moderation-logic.ts` (it already has `import type { ModerationResponse } from "@makespritecode/shared";` and the `ModerationResultInput` interface):

```typescript
// Kid-stricter Showcase gate (ADR-0008). On top of OpenAI's own `flagged`, block
// if any sensitive category scores over a low custom threshold — erring toward
// false positives is the safe direction for a minors-facing public wall.
export const SHOWCASE_STRICT_THRESHOLDS: Record<string, number> = {
  sexual: 0.2,
  "sexual/minors": 0.05,
  hate: 0.2,
  "self-harm": 0.2,
  violence: 0.3,
};

export function isShowcaseContentFlagged(result: ModerationResultInput): boolean {
  if (result.flagged) return true;
  for (const [category, threshold] of Object.entries(SHOWCASE_STRICT_THRESHOLDS)) {
    if ((result.category_scores[category] ?? 0) >= threshold) return true;
  }
  return false;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd server && bun test src/moderation-logic.test.ts`
Expected: PASS (existing tests + 5 new).

- [ ] **Step 5: Commit**

```bash
git add server/src/moderation-logic.ts server/src/moderation-logic.test.ts
git commit -m "feat(server): kid-stricter Showcase moderation thresholds"
```

---

## Task 4: Showcase pure helpers — dedupe, row mapping, read cache (server, TDD)

**Files:**
- Create: `server/src/showcase.ts`
- Test: `server/src/showcase.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `server/src/showcase.test.ts`:

```typescript
import { test, expect, describe } from "bun:test";
import { isDuplicate, mapSheetRows, createShowcaseCache } from "./showcase";
import type { ShowcaseEntry } from "@makespritecode/shared";

const entry = (imgLiteral: string): ShowcaseEntry => ({
  name: "Jo",
  title: "Slime",
  imgLiteral,
  width: 1,
  height: 1,
  palette: { ".": "#000" },
});

describe("isDuplicate", () => {
  test("true when an entry with the same imgLiteral exists", () => {
    expect(isDuplicate([entry("img`\n1\n`")], "img`\n1\n`")).toBe(true);
  });
  test("false otherwise", () => {
    expect(isDuplicate([entry("img`\n1\n`")], "img`\n2\n`")).toBe(false);
  });
});

describe("mapSheetRows", () => {
  test("maps raw Apps Script rows to valid ShowcaseEntry, dropping invalid", () => {
    const raw = [
      { name: "A", title: "T", imgLiteral: "img`\n1\n`", width: 1, height: 1, palette: { ".": "#000" } },
      { name: "", title: "bad", imgLiteral: "x", width: 0, height: 0, palette: {} }, // invalid -> dropped
    ];
    const out = mapSheetRows(raw);
    expect(out.length).toBe(1);
    expect(out[0].name).toBe("A");
  });
});

describe("createShowcaseCache", () => {
  test("calls the fetcher once within the TTL, refetches after it, and on invalidate", async () => {
    let calls = 0;
    let clock = 1000;
    const cache = createShowcaseCache({
      fetcher: async () => { calls++; return [entry("img`\n" + calls + "\n`")]; },
      ttlMs: 100,
      now: () => clock,
    });
    await cache.get();                 // calls = 1
    await cache.get();                 // cached, calls still 1
    expect(calls).toBe(1);
    clock = 1201;                      // past TTL
    await cache.get();                 // calls = 2
    expect(calls).toBe(2);
    cache.invalidate();
    await cache.get();                 // calls = 3
    expect(calls).toBe(3);
  });

  test("on fetcher error returns the last good value, or [] if never succeeded", async () => {
    const cache = createShowcaseCache({
      fetcher: async () => { throw new Error("apps script down"); },
      ttlMs: 100,
      now: () => 0,
    });
    expect(await cache.get()).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd server && bun test src/showcase.test.ts`
Expected: FAIL — module `./showcase` not found.

- [ ] **Step 3: Implement the pure helpers**

Create `server/src/showcase.ts`:

```typescript
import { ShowcaseEntrySchema } from "@makespritecode/shared";
import type { ShowcaseEntry } from "@makespritecode/shared";

/** True if a sprite with this exact img-literal is already in the window. */
export function isDuplicate(entries: ShowcaseEntry[], imgLiteral: string): boolean {
  return entries.some((e) => e.imgLiteral === imgLiteral);
}

/** Validate + coerce raw Apps Script rows into Showcase entries, dropping any
 *  that fail the schema (never trust the sheet). */
export function mapSheetRows(rows: unknown[]): ShowcaseEntry[] {
  const out: ShowcaseEntry[] = [];
  for (const row of rows) {
    const parsed = ShowcaseEntrySchema.safeParse(row);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

interface ShowcaseCacheDeps {
  fetcher: () => Promise<ShowcaseEntry[]>;
  ttlMs: number;
  now: () => number;
}

/** A tiny TTL cache around a fetcher. Many client polls collapse to one upstream
 *  read per TTL. On fetch error, serve the last good value (or [] if none). */
export function createShowcaseCache({ fetcher, ttlMs, now }: ShowcaseCacheDeps) {
  let value: ShowcaseEntry[] = [];
  let fetchedAt = -Infinity;
  let primed = false;

  async function get(): Promise<ShowcaseEntry[]> {
    if (primed && now() - fetchedAt < ttlMs) return value;
    try {
      value = await fetcher();
      fetchedAt = now();
      primed = true;
    } catch (err) {
      console.warn(`Showcase fetch failed, serving cached (${err})`);
    }
    return value;
  }

  function invalidate() {
    fetchedAt = -Infinity;
  }

  return { get, invalidate };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd server && bun test src/showcase.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add server/src/showcase.ts server/src/showcase.test.ts
git commit -m "feat(server): Showcase pure helpers (dedupe, row mapping, read cache)"
```

---

## Task 5: Config + Apps Script client + image moderation (server, integration glue)

These touch external services, so per repo convention they get no unit test (validation/pure logic is already covered). Verify by typecheck.

**Files:**
- Modify: `server/src/config.ts`
- Modify: `server/.env.example`
- Modify: `server/src/openai.ts`
- Modify: `server/src/showcase.ts`

- [ ] **Step 1: Add config vars**

In `server/src/config.ts`, add to the `config` object literal:

```typescript
  APPS_SCRIPT_URL: process.env.APPS_SCRIPT_URL ?? "",
  APPS_SCRIPT_TOKEN: process.env.APPS_SCRIPT_TOKEN ?? "",
  SHOWCASE_CACHE_TTL_MS: Number(process.env.SHOWCASE_CACHE_TTL_MS) || 15000,
```

In `server/.env.example`, append:

```
# Community Showcase (Google Apps Script web app bound to the Submissions sheet)
APPS_SCRIPT_URL=
APPS_SCRIPT_TOKEN=
SHOWCASE_CACHE_TTL_MS=15000
```

- [ ] **Step 2: Add `moderateImage` to openai.ts**

Append to `server/src/openai.ts` (it already has the lazy `client()` and `moderatePrompt`):

```typescript
// Free image moderation via the same omni-moderation model. The sprite PNG is a
// data: URL rendered by the client (already upscaled at PIXEL_SIZE).
export async function moderateImage(imageDataUrl: string) {
  return client().moderations.create({
    model: "omni-moderation-latest",
    // OpenAI's typed input doesn't include image entries in this SDK version yet.
    input: [{ type: "image_url", image_url: { url: imageDataUrl } }] as never,
  });
}
```

- [ ] **Step 3: Add the Apps Script fetchers to showcase.ts**

Append to `server/src/showcase.ts`:

```typescript
import { config } from "./config";
import type { ShowcaseSubmitRequest } from "@makespritecode/shared";

/** POST one submission to the Apps Script web app (token-gated append + roll). */
export async function submitToSheet(req: ShowcaseSubmitRequest): Promise<void> {
  if (!config.APPS_SCRIPT_URL) throw new Error("APPS_SCRIPT_URL not configured");
  const res = await fetch(config.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: config.APPS_SCRIPT_TOKEN,
      name: req.name,
      title: req.title,
      prompt: req.prompt ?? "",
      imgLiteral: req.imgLiteral,
      width: req.width,
      height: req.height,
      palette: JSON.stringify(req.palette),
    }),
  });
  const body = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean };
  if (!res.ok || !body.ok) throw new Error("Apps Script append failed");
}

/** GET the current window from the Apps Script web app. */
export async function fetchFromSheet(): Promise<ShowcaseEntry[]> {
  if (!config.APPS_SCRIPT_URL) return [];
  const res = await fetch(config.APPS_SCRIPT_URL, { method: "GET" });
  if (!res.ok) throw new Error(`Apps Script read ${res.status}`);
  const body = (await res.json()) as { entries?: unknown[] };
  return mapSheetRows(body.entries ?? []);
}

// The process-wide read cache (one per server). Production wiring used by app.ts.
export const showcaseCache = createShowcaseCache({
  fetcher: fetchFromSheet,
  ttlMs: config.SHOWCASE_CACHE_TTL_MS,
  now: () => Date.now(),
});
```

- [ ] **Step 4: Typecheck**

Run: `bun run --filter server typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/src/config.ts server/.env.example server/src/openai.ts server/src/showcase.ts
git commit -m "feat(server): config, image moderation, and Apps Script client for Showcase"
```

---

## Task 6: Server routes — submit + read (TDD on validation)

**Files:**
- Modify: `server/src/app.ts`
- Test: `server/src/app.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `server/src/app.test.ts` inside (or after) the existing `describe` blocks:

```typescript
describe("showcase routes", () => {
  test("submit: 422 on missing fields", async () => {
    const res = await app.request("/showcase/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Jo" }), // missing title/imgLiteral/etc.
    });
    expect(res.status).toBe(422);
  });

  test("GET /showcase returns 200 with an entries array (empty when unconfigured)", async () => {
    const res = await app.request("/showcase");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.entries)).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd server && bun test src/app.test.ts`
Expected: FAIL — submit returns 404 (route missing); GET /showcase returns 404.

- [ ] **Step 3: Implement the routes**

In `server/src/app.ts`, extend the shared import and the `./openai` / `./moderation-logic` / `./showcase` imports:

```typescript
import {
  ModerationRequestSchema,
  OpenAISpriteRequestSchema,
  ShowcaseSubmitRequestSchema,
} from "@makespritecode/shared";
import { generateOpenAISprite, moderatePrompt, moderateImage } from "./openai";
import { applyModerationOverride, isShowcaseContentFlagged } from "./moderation-logic";
import { isDuplicate, submitToSheet, showcaseCache } from "./showcase";
```

Add a module-level rate limiter and the two routes (place before the `notFound`/`onError` handlers at the bottom of the file):

```typescript
// Simple in-memory per-IP rate limit for submits (free endpoint, but floodable).
const submitHits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (submitHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  submitHits.set(ip, hits);
  return hits.length > max;
}

app.post("/showcase/submit", async (c) => {
  const parsed = ShowcaseSubmitRequestSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ success: false, error: "Invalid request", detail: parsed.error.issues }, 422);
  }
  const ip = c.req.header("x-forwarded-for") ?? "unknown";
  if (rateLimited(ip)) return c.json({ ok: false, reason: "rate_limited" });

  const req = parsed.data;

  // Free text moderation on the public fields (name + title).
  const textMod = await moderatePrompt(`${req.name}\n${req.title}`);
  const textResult = textMod.results[0];
  if (textResult && isShowcaseContentFlagged({
    flagged: textResult.flagged,
    categories: textResult.categories as unknown as Record<string, boolean>,
    category_scores: textResult.category_scores as unknown as Record<string, number>,
  })) {
    return c.json({ ok: false, reason: "text" });
  }

  // Free image moderation on the rendered sprite.
  const imgMod = await moderateImage(req.imageDataUrl);
  const imgResult = imgMod.results[0];
  if (imgResult && isShowcaseContentFlagged({
    flagged: imgResult.flagged,
    categories: imgResult.categories as unknown as Record<string, boolean>,
    category_scores: imgResult.category_scores as unknown as Record<string, number>,
  })) {
    return c.json({ ok: false, reason: "image" });
  }

  // Dedupe against the current window — re-copying a sprite shouldn't flood it.
  const current = await showcaseCache.get();
  if (isDuplicate(current, req.imgLiteral)) {
    return c.json({ ok: true, duplicate: true });
  }

  await submitToSheet(req);
  showcaseCache.invalidate(); // next read includes the new sprite
  return c.json({ ok: true });
});

app.get("/showcase", async (c) => {
  const entries = await showcaseCache.get(); // cache swallows errors -> []
  return c.json({ entries });
});
```

Note: `applyModerationOverride` stays imported for the existing `/moderation/moderate` route — leave that route unchanged.

- [ ] **Step 4: Run to verify the new validation tests pass**

Run: `cd server && bun test`
Expected: PASS — all existing tests plus the two new showcase tests. (The submit happy-path is not unit-tested; it requires OpenAI + Apps Script and is verified manually in Task 11.)

- [ ] **Step 5: Typecheck + commit**

Run: `bun run --filter server typecheck` → PASS

```bash
git add server/src/app.ts server/src/app.test.ts
git commit -m "feat(server): /showcase/submit (moderate+dedupe+append) and cached /showcase"
```

---

## Task 7: The Google Apps Script + Sheet (deployable artifact)

**Files:**
- Create: `server/google-apps-script/Showcase.gs`
- Create: `server/google-apps-script/README.md`

This is the datastore. The code ships in-repo; the maintainer deploys it once.

- [ ] **Step 1: Write the Apps Script**

Create `server/google-apps-script/Showcase.gs`:

```javascript
// Showcase datastore for makespritecode. Bound to a Google Sheet with a tab
// named "Submissions" and a header row:
// Timestamp | Name | Title | Prompt | ImgLiteral | Width | Height | Palette
//
// Deploy: Extensions > Apps Script, paste this, set TOKEN below, then
// Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
// Put the /exec URL + TOKEN into the server env (APPS_SCRIPT_URL/APPS_SCRIPT_TOKEN).

var TOKEN = "CHANGE-ME-to-a-long-random-string";
var MAX_ROWS = 18; // rolling window: 12 shown + 6 deletion buffer

function sheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var b = JSON.parse(e.postData.contents);
  if (b.token !== TOKEN) return json({ ok: false, error: "unauthorized" });
  var s = sheet();
  s.appendRow([
    new Date(), b.name, b.title, b.prompt,
    b.imgLiteral, b.width, b.height, b.palette,
  ]);
  var extra = s.getLastRow() - 1 - MAX_ROWS; // row 1 is the header
  if (extra > 0) s.deleteRows(2, extra);     // drop the oldest
  return json({ ok: true });
}

function doGet() {
  var s = sheet();
  var values = s.getDataRange().getValues();
  values.shift(); // drop header
  var entries = values.map(function (r) {
    return {
      name: r[1],
      title: r[2],
      imgLiteral: r[4],
      width: r[5],
      height: r[6],
      palette: JSON.parse(r[7] || "{}"),
    }; // NOTE: Prompt (r[3]) is intentionally omitted — it stays private.
  }).reverse(); // newest first
  return json({ entries: entries });
}
```

- [ ] **Step 2: Write the setup README**

Create `server/google-apps-script/README.md`:

```markdown
# Showcase datastore setup (one-time, ~10 min)

1. Create a Google Sheet. Rename the first tab to `Submissions`.
2. Put this header in row 1 (columns A–H):
   `Timestamp | Name | Title | Prompt | ImgLiteral | Width | Height | Palette`
3. Extensions → Apps Script. Delete the stub, paste `Showcase.gs`.
4. Set `TOKEN` to a long random string (e.g. from a password generator).
5. Deploy → New deployment → type "Web app". Execute as **Me**, access **Anyone**. Copy the `/exec` URL.
6. In the server env set `APPS_SCRIPT_URL=<the /exec URL>` and `APPS_SCRIPT_TOKEN=<the same TOKEN>`.

To remove a Submission: delete its row in the sheet (gone within one ~15s cache cycle).
The sheet self-trims to the 18 newest rows on every submit.
```

- [ ] **Step 3: Commit**

```bash
git add server/google-apps-script/
git commit -m "feat(server): Apps Script datastore + deploy guide for Showcase"
```

---

## Task 8: Client plumbing — types, constants, API, context, profanity util

**Files:**
- Modify: `client/src/types/export.ts`
- Modify: `client/src/constants/api.ts`
- Create: `client/src/api/submitShowcase.ts`
- Create: `client/src/api/fetchShowcase.ts`
- Create: `client/src/context/ShowcaseContext/ShowcaseContext.tsx`
- Create: `client/src/context/ShowcaseContext/useShowcase.ts`
- Modify: `client/src/providers/GlobalProviders.tsx`
- Create: `client/src/features/Showcase/showcaseTextCheck.ts`

- [ ] **Step 1: Re-export the new shared types**

In `client/src/types/export.ts`, add to the existing `export type { ... } from "@makespritecode/shared";` block:

```typescript
  ShowcaseSubmitRequest,
  ShowcaseEntry,
  ShowcaseResponse,
```

- [ ] **Step 2: Add API URL constants**

In `client/src/constants/api.ts`, append:

```typescript
export const SHOWCASE_SUBMIT_API_URL = `${API_BASE_URL}/showcase/submit`;
export const SHOWCASE_FETCH_API_URL = `${API_BASE_URL}/showcase`;
```

- [ ] **Step 3: Submit API**

Create `client/src/api/submitShowcase.ts`:

```typescript
import { SHOWCASE_SUBMIT_API_URL } from "../constants/api";
import type { ShowcaseSubmitRequest } from "../types/export";

export interface SubmitShowcaseResult {
  ok: boolean;
  reason?: "text" | "image" | "rate_limited";
  duplicate?: boolean;
}

export async function submitShowcase(
  request: ShowcaseSubmitRequest,
): Promise<SubmitShowcaseResult> {
  const response = await fetch(SHOWCASE_SUBMIT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Showcase submit error: ${response.statusText}`);
  }
  return response.json();
}
```

- [ ] **Step 4: Fetch API**

Create `client/src/api/fetchShowcase.ts`:

```typescript
import { SHOWCASE_FETCH_API_URL } from "../constants/api";
import type { ShowcaseEntry, ShowcaseResponse } from "../types/export";

export async function fetchShowcase(): Promise<ShowcaseEntry[]> {
  const response = await fetch(SHOWCASE_FETCH_API_URL);
  if (!response.ok) {
    throw new Error(`Showcase fetch error: ${response.statusText}`);
  }
  const body: ShowcaseResponse = await response.json();
  return body.entries;
}
```

- [ ] **Step 5: Showcase context (the home page's store)**

Create `client/src/context/ShowcaseContext/ShowcaseContext.tsx`:

```typescript
import { createStateContext } from "../createStateContext";
import type { ShowcaseEntry } from "../../types/export";

// App-wide so an optimistic insert from the studio survives navigation to home.
const { Context: ShowcaseContext, Provider: ShowcaseProvider } =
  createStateContext<ShowcaseEntry[]>(() => []);

export { ShowcaseContext, ShowcaseProvider };
```

Create `client/src/context/ShowcaseContext/useShowcase.ts`:

```typescript
import { useContext } from "react";
import { ShowcaseContext } from "./ShowcaseContext";

export function useShowcase() {
  const ctx = useContext(ShowcaseContext);
  if (!ctx) throw new Error("useShowcase must be used within ShowcaseProvider");
  return { entries: ctx.value, setEntries: ctx.setValue };
}
```

- [ ] **Step 6: Mount the provider**

In `client/src/providers/GlobalProviders.tsx`, add the import and wrap (outermost is fine — it's app-wide, non-editor state):

```typescript
import { ShowcaseProvider } from "../context/ShowcaseContext/ShowcaseContext";
```

Wrap the existing `<TokenProvider>...</TokenProvider>` with `<ShowcaseProvider>`:

```tsx
    <ShowcaseProvider>
      <TokenProvider>
        {/* ...existing nesting unchanged... */}
      </TokenProvider>
    </ShowcaseProvider>
```

- [ ] **Step 7: Client-side profanity pre-check**

Create `client/src/features/Showcase/showcaseTextCheck.ts`:

```typescript
import { Filter } from "bad-words";

// Instant client-side reject for obvious profanity in name/title before we POST.
// The server re-checks authoritatively; this is just fast feedback.
export function showcaseTextError(name: string, title: string): string | null {
  const filter = new Filter();
  if (!name.trim()) return "Add a first name or nickname.";
  if (!title.trim()) return "Give your sprite a title.";
  if (filter.isProfane(name)) return "Let's keep the name school-appropriate.";
  if (filter.isProfane(title)) return "Let's keep the title school-appropriate.";
  return null;
}
```

- [ ] **Step 8: Typecheck + commit**

Run: `cd client && bun run css:build && tsc -b`
Expected: PASS (type check clean).

```bash
git add client/src/types/export.ts client/src/constants/api.ts client/src/api/submitShowcase.ts client/src/api/fetchShowcase.ts client/src/context/ShowcaseContext/ client/src/providers/GlobalProviders.tsx client/src/features/Showcase/showcaseTextCheck.ts
git commit -m "feat(client): Showcase types, API, context, and profanity pre-check"
```

---

## Task 9: Shared sprite grid + tile (client rendering)

**Files:**
- Create: `client/src/features/Showcase/SpriteTile.tsx`
- Create: `client/src/features/Showcase/SpriteGrid.tsx`

The client has no test suite — verify by rendering in the browser preview.

- [ ] **Step 1: SpriteTile (renders one entry to a canvas)**

Create `client/src/features/Showcase/SpriteTile.tsx`:

```tsx
import { useEffect, useRef } from "react";
import type { ShowcaseEntry } from "../../types/export";
import { parseMakeCodeSprite } from "../../utils/makeCodeSpriteValidation";
import { drawSpriteDataOnCanvasTransparent } from "../SpriteEditor/libs/drawPixelOnCanvas";

const TILE_PIXEL = 8; // bitmap scale; CSS upsizes with pixelated rendering

export function SpriteTile({ entry }: { entry: ShowcaseEntry }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let data;
    try {
      data = parseMakeCodeSprite(entry.imgLiteral);
    } catch {
      return; // invalid literal — leave the canvas blank
    }
    canvas.width = entry.width * TILE_PIXEL;
    canvas.height = entry.height * TILE_PIXEL;
    drawSpriteDataOnCanvasTransparent(canvas, { x: 0, y: 0 }, data, entry.palette, TILE_PIXEL, 1);
  }, [entry]);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-sm">
      <div className="transparent flex aspect-square items-center justify-center p-2">
        <canvas
          ref={ref}
          className="h-full w-full"
          style={{ imageRendering: "pixelated", objectFit: "contain" }}
          aria-label={`${entry.title} by ${entry.name}`}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <span className="truncate font-mono text-xs text-ink-muted">{entry.title}</span>
        <span className="shrink-0 font-mono text-2xs text-ink-subtle">by {entry.name}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: SpriteGrid (3×4 grid + optional "Be the first" filler tiles)**

Create `client/src/features/Showcase/SpriteGrid.tsx`:

```tsx
import type { ShowcaseEntry } from "../../types/export";
import { SpriteTile } from "./SpriteTile";

interface SpriteGridProps {
  entries: ShowcaseEntry[];
  /** When set, pad up to this many cells with "Be the first" placeholders. */
  fillTo?: number;
}

export function SpriteGrid({ entries, fillTo }: SpriteGridProps) {
  const placeholders = fillTo ? Math.max(0, fillTo - entries.length) : 0;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((entry, i) => (
        <SpriteTile key={`${entry.imgLiteral}-${i}`} entry={entry} />
      ))}
      {Array.from({ length: placeholders }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          className="flex aspect-[1/1.18] items-center justify-center rounded-card border border-dashed border-line text-center font-mono text-2xs text-ink-subtle">
          Your sprite could be here →
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit (verified visually in Task 11)**

```bash
git add client/src/features/Showcase/SpriteTile.tsx client/src/features/Showcase/SpriteGrid.tsx
git commit -m "feat(client): shared SpriteGrid + canvas SpriteTile"
```

---

## Task 10: Submit modal (studio) + wiring

**Files:**
- Create: `client/src/pages/StudioPage/modals/SubmitModal.tsx`
- Modify: `client/src/pages/StudioPage/modals/ExportModal.tsx`
- Modify: `client/src/pages/StudioPage/StudioPage.tsx`

- [ ] **Step 1: Build the Submit modal**

Create `client/src/pages/StudioPage/modals/SubmitModal.tsx`. It gathers its own data from contexts (it renders inside GlobalProviders), builds the request, runs the client profanity pre-check, POSTs, and on success optimistically inserts into the Showcase context.

```tsx
import { useState } from "react";
import Modal from "../../../components/Modal/Modal"; // default export
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useOpenAISettings } from "../../../context/OpenAISettingsContext/useOpenAISettings";
import { useGenerationMethod } from "../../../context/GenerationMethodContext/useGenerationMethod";
import { useShowcase } from "../../../context/ShowcaseContext/useShowcase";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { regionToImgLiteral } from "../../../features/SpriteEditor/libs/serializeSpriteRegion";
import { showcaseTextError } from "../../../features/Showcase/showcaseTextCheck";
import { submitShowcase } from "../../../api/submitShowcase";
import { GenerationMethod, ImageExportFormats } from "../../../types/export";
import type { ShowcaseEntry } from "../../../types/export";

type Status = { kind: "idle" | "sending" | "done" | "error"; message?: string };

export function SubmitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { spriteData } = useSprite();
  const { width, height } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { settings } = useOpenAISettings();
  const { selectedMethod } = useGenerationMethod();
  const { setEntries } = useShowcase();
  const { getSpriteDataUrl } = useExportSpriteData();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const isBlank = spriteData.every((row) => row.every((c) => c === "."));

  async function handleSubmit() {
    const textError = showcaseTextError(name, title);
    if (textError) return setStatus({ kind: "error", message: textError });
    if (isBlank) return setStatus({ kind: "error", message: "Draw something first!" });

    setStatus({ kind: "sending" });
    const imgLiteral = regionToImgLiteral(spriteData);
    try {
      const result = await submitShowcase({
        name: name.trim(),
        title: title.trim(),
        prompt: selectedMethod === GenerationMethod.TextToSprite ? settings.prompt : undefined,
        imgLiteral,
        width,
        height,
        palette,
        imageDataUrl: getSpriteDataUrl(ImageExportFormats.PNG),
      });
      if (result.ok) {
        const entry: ShowcaseEntry = { name: name.trim(), title: title.trim(), imgLiteral, width, height, palette };
        if (!result.duplicate) setEntries((prev) => [entry, ...prev]);
        setStatus({
          kind: "done",
          message: result.duplicate ? "Already in the Showcase ✓" : "🎉 On the wall!",
        });
      } else if (result.reason === "rate_limited") {
        setStatus({ kind: "error", message: "One sec — try again in a moment." });
      } else {
        setStatus({ kind: "error", message: "That didn't pass our auto-check — try a different name, title, or sprite." });
      }
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the Showcase — your sprite is still copied!" });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Feature this on makespritecode!"
      subtitle="Put your sprite on the wall — just add a name and a title.">
      {status.kind === "done" ? (
        <div className="py-4 text-center">
          <p className="text-lg">{status.message}</p>
          <button className="mt-4 rounded-card border border-line px-4 py-2" onClick={onClose}>Close</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">Nice work! Add a name and a title to put it on the wall.</p>
          <label className="text-sm">First name or nickname
            <input className="mt-1 w-full rounded-card border border-line px-3 py-2"
              maxLength={24} value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PixelNinja" />
          </label>
          <label className="text-sm">Title
            <input className="mt-1 w-full rounded-card border border-line px-3 py-2"
              maxLength={40} value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lava Dragon" />
          </label>
          <p className="text-2xs text-ink-subtle">Shown publicly on the site — never use your full name.</p>
          {status.kind === "error" && <p className="text-sm text-red-500">{status.message}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button className="rounded-card px-4 py-2 text-ink-muted" onClick={onClose}>Maybe later</button>
            <button className="rounded-card border border-line bg-surface-raised px-4 py-2 disabled:opacity-50"
              disabled={status.kind === "sending"} onClick={handleSubmit}>
              {status.kind === "sending" ? "Sending…" : "Submit ✨"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
```

(`Modal` is a default export taking `isOpen`, `onClose`, `size`, `title`, `subtitle`, and children — verified against `ExportModal.tsx`.)

- [ ] **Step 2: Fire a callback after a successful Copy**

`ExportModal` is a default export with a `Props` interface (`{ isOpen, onClose }`). Make three exact edits in `client/src/pages/StudioPage/modals/ExportModal.tsx`:

Add the optional prop to the interface (currently lines 11-14):

```tsx
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess?: () => void;
}
```

Destructure it in the signature (line 18):

```tsx
export default function ExportModal({ isOpen, onClose, onCopySuccess }: Props) {
```

Call it in the existing `copyForMakeCode` handler (lines 40-48), right after `setCopied(true)`:

```tsx
  const copyForMakeCode = async () => {
    try {
      await navigator.clipboard.writeText(getImgCode());
      setCopied(true);
      onCopySuccess?.();                       // ← open the Submit modal
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };
```

- [ ] **Step 3: Wire both modals in StudioPage**

In `client/src/pages/StudioPage/StudioPage.tsx`: add `const submitModal = useModal();` next to the existing `exportModal` etc., pass `onCopySuccess={submitModal.open}` to `<ExportModal>`, and render `<SubmitModal>`:

```tsx
import { SubmitModal } from "./modals/SubmitModal";
// ...
const submitModal = useModal();
// ...
<ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} onCopySuccess={submitModal.open} />
<SubmitModal isOpen={submitModal.isOpen} onClose={submitModal.close} />
```

- [ ] **Step 4: Typecheck + commit**

Run: `cd client && tsc -b` → PASS

```bash
git add client/src/pages/StudioPage/modals/SubmitModal.tsx client/src/pages/StudioPage/modals/ExportModal.tsx client/src/pages/StudioPage/StudioPage.tsx
git commit -m "feat(client): Submit modal opened after Copy, with optimistic insert"
```

---

## Task 11: Showcase section on the home page (live feed)

**Files:**
- Create: `client/src/features/Showcase/useShowcaseFeed.ts`
- Create: `client/src/pages/HeroPage/components/ShowcaseSection.tsx`
- Modify: `client/src/pages/HeroPage/HeroPage.tsx`

- [ ] **Step 1: The feed hook (localStorage SWR + visible-tab polling)**

Create `client/src/features/Showcase/useShowcaseFeed.ts`:

```typescript
import { useEffect } from "react";
import { useShowcase } from "../../context/ShowcaseContext/useShowcase";
import { fetchShowcase } from "../../api/fetchShowcase";
import type { ShowcaseEntry } from "../../types/export";

const CACHE_KEY = "showcase.entries.v1";
const POLL_MS = 15000;

export function useShowcaseFeed() {
  const { entries, setEntries } = useShowcase();

  useEffect(() => {
    // Stale-while-revalidate: paint last-seen instantly, then refresh.
    if (entries.length === 0) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) setEntries(JSON.parse(cached) as ShowcaseEntry[]);
      } catch { /* ignore */ }
    }

    let cancelled = false;
    async function refresh() {
      if (document.hidden) return;
      try {
        const fresh = await fetchShowcase();
        if (cancelled) return;
        setEntries(fresh);
        localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      } catch { /* keep showing cached */ }
    }
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return entries;
}
```

- [ ] **Step 2: The section**

Create `client/src/pages/HeroPage/components/ShowcaseSection.tsx`:

```tsx
import { SpriteGrid } from "../../../features/Showcase/SpriteGrid";
import { useShowcaseFeed } from "../../../features/Showcase/useShowcaseFeed";

export function ShowcaseSection() {
  const entries = useShowcaseFeed().slice(0, 12);
  return (
    <section id="showcase" className="mx-auto w-full max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold">Made by our ninjas</h2>
      <p className="mt-1 text-ink-muted">Fresh sprites from the community — make one and it lands here.</p>
      <SpriteGrid entries={entries} fillTo={12} />
    </section>
  );
}
```

- [ ] **Step 3: Place it just under the hero**

In `client/src/pages/HeroPage/HeroPage.tsx`, import `ShowcaseSection` and render it immediately after the hero `</section>` (around line 131, before `<ExampleGallery />`):

```tsx
import { ShowcaseSection } from "./components/ShowcaseSection";
// ...
{/* ...hero section ends... */}
<ShowcaseSection />
<ExampleGallery />
```

- [ ] **Step 4: Verify in the browser (no client tests exist)**

Start the dev server (client + server) and verify:
1. `preview_start` (or `bun run dev`), open the home page.
2. `preview_snapshot` — the "Made by our ninjas" section renders 12 "Your sprite could be here →" tiles (empty state).
3. In the studio: generate/draw a sprite → open Export → click Copy → the Submit modal appears.
4. Enter a name + title → Submit → expect "🎉 On the wall!" (requires the server running with `APPS_SCRIPT_URL`/`APPS_SCRIPT_TOKEN` set; otherwise expect the friendly "Couldn't reach the Showcase" path, which still proves the wiring).
5. Reload the home page → the new sprite renders as a crisp pixel canvas in the grid.
6. `preview_console_logs` — no errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/features/Showcase/useShowcaseFeed.ts client/src/pages/HeroPage/components/ShowcaseSection.tsx client/src/pages/HeroPage/HeroPage.tsx
git commit -m "feat(client): live Showcase section under the hero"
```

---

## Task 12: Realize the curated Examples section

**Files:**
- Create: `client/src/pages/HeroPage/components/exampleSprites.ts`
- Modify: `client/src/pages/HeroPage/components/ExampleGallery.tsx`

- [ ] **Step 1: Curated sprite data**

Create `client/src/pages/HeroPage/components/exampleSprites.ts`. Seed with a few real sprites (the maintainer edits this file to swap in their best work). Each is a `ShowcaseEntry`. Use a real palette object — import the default `ArcadePalette`.

```typescript
import { ArcadePalette } from "../../../types/color"; // exported at color.ts:70
import type { ShowcaseEntry } from "../../../types/export";

// Maintainer-curated demo sprites ("what this app can do"). Replace the literals
// with real exports: in the studio, copy a sprite and paste its img`...` here.
export const EXAMPLE_SPRITES: ShowcaseEntry[] = [
  {
    name: "makespritecode",
    title: "replace me",
    width: 4,
    height: 4,
    palette: ArcadePalette,
    imgLiteral: "img`\n2222\n2552\n2552\n2222\n`",
  },
  // ...add 8–11 more curated entries...
];
```

(`ArcadePalette` is `export const ArcadePalette: MakeCodePalette` in `client/src/types/color.ts:70` — the same default `PaletteSelectedContext` uses.)

- [ ] **Step 2: Swap ExampleGallery to render real sprites**

Replace the placeholder `EXAMPLES` map in `client/src/pages/HeroPage/components/ExampleGallery.tsx` with the shared grid:

```tsx
import { SpriteGrid } from "../../../features/Showcase/SpriteGrid";
import { EXAMPLE_SPRITES } from "./exampleSprites";

// ...inside the component's returned section, replace the old grid <div>...</div> with:
<SpriteGrid entries={EXAMPLE_SPRITES} />
```

Keep the section's existing heading/markup; only the grid body changes.

- [ ] **Step 3: Verify + commit**

Verify in preview: the Examples section now shows real pixel sprites (not color squares), same tile styling as the Showcase.

```bash
git add client/src/pages/HeroPage/components/exampleSprites.ts client/src/pages/HeroPage/components/ExampleGallery.tsx
git commit -m "feat(client): render curated real sprites in the Examples gallery"
```

---

## Task 13: Final verification + docs

**Files:**
- Modify: `client/.env.example` (document nothing new is needed — Apps Script is server-only) — optional.

- [ ] **Step 1: Full server test + typecheck + lint**

```bash
cd server && bun test                 # all green
bun run --filter server typecheck     # clean
cd ../client && tsc -b && bun run lint # clean
```

- [ ] **Step 2: End-to-end smoke (server configured)**

With `APPS_SCRIPT_URL`/`APPS_SCRIPT_TOKEN` set on the server and the Sheet/script deployed (Task 7):
1. Submit a clean sprite from the studio → appears in the sheet → shows on the home page within ~15s.
2. Submit with a profane name → blocked with the friendly message; nothing added to the sheet.
3. Submit the same sprite twice → second shows "Already in the Showcase ✓"; only one row in the sheet.
4. Delete that row in the sheet → it disappears from the home page within ~15s.
5. Open the home page in two tabs → submit from the studio → both tabs' grids fill within ~15s (live wall).

- [ ] **Step 3: Update CONTEXT.md status note (optional)** and commit any final tweaks.

```bash
git add -A
git commit -m "chore: Showcase verification pass"
```

---

## Spec coverage check

- Eligibility (any sprite) → Submit modal reads current sprite regardless of origin (Task 10). ✅
- Trigger after every Copy → `onCopySuccess` (Task 10). ✅
- Dedupe by img-literal → server `isDuplicate` + sheet (Tasks 4, 6); client message (Task 10). ✅
- Name/title (first name/nickname, public notice, profanity) → Tasks 8, 10. ✅
- Layout 3×4 / show 12 / near hero → Tasks 9, 11. ✅
- Rolling store 18 + deletion removes → Apps Script `MAX_ROWS` (Task 7). ✅
- Honest "Be the first" empty state → `fillTo` (Tasks 9, 11). ✅
- Live wall via server-cached polling → Tasks 4/5/6 (cache) + 11 (poll). ✅
- Stricter-for-kids moderation (text + image) → Tasks 3, 5, 6. ✅
- Server-only Apps Script (URL+token), best-effort submit decoupled from Copy → Tasks 5, 6, 10. ✅
- Examples = curated real sprites, shared grid → Task 12. ✅
- ADR 0008 / CONTEXT terms committed → Task 1. ✅

## Known follow-ups (out of scope here)

- The submit happy-path and image-moderation calls aren't unit-tested (repo convention: no network in tests; covered by the manual smoke in Task 13).
- HeroPage merge coordination with the pending motion redesign (both edit `HeroPage`/`ExampleGallery`).
- Optional: keep the Render server warm to avoid a cold-start delay on the first home-page load.
