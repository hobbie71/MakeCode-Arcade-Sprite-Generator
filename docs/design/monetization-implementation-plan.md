# Ad-During-Generation Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an ayeT on-demand video ad while a sprite generates, reveal the sprite only after the ad finishes, and bound the paid endpoint with a per-IP rate limit — no database, no token economy.

**Architecture:** Path B from the monetization grilling (see [ADR-0009](../adr/0009-ad-during-generation-over-token-economy.md)). The client already shows an ad in `LoadingOverlay` during the ~1–2 min generation wait; we swap that AdSense display unit for an ayeT fullscreen video, add a *soft client-side gate* (await both the image AND the ad before revealing), and strip the mock token UI. The server gains one stateless in-memory per-IP rate-limit middleware. Two static legal pages (Privacy, Terms) and a footer are added because ad networks require a published privacy policy.

**Tech Stack:** Bun monorepo · React 19 + TypeScript (client, Bun bundler) · Hono (server) · React Router v7 · ayeT-Studios HTML5 rewarded-video SDK · `bun:test` + happy-dom + React Testing Library.

## Global Constraints

- **No database, no device IDs, no token ledger, no S2S callback.** The token economy is *deferred* — its spec lives in `CONTEXT.md` under "Monetization (deferred)" and the future batch/animation PR.
- **Non-personalized ads for EVERYONE, always** — set in the ayeT dashboard AND passed in the SDK init. This is the blanket COPPA-safety posture; there is intentionally **no age screen**.
- **Rewarded video only — NO offerwall.** Offerwall is non-compliant for under-13 and is the biggest brand-safety risk.
- **Soft gate is client-side only.** Revealing the sprite waits for the ad, but it is NOT cryptographically enforced (acceptable for this audience). Never gate on anything the server must trust.
- **Ad failure must never block the user.** If ayeT no-fills, errors, or the SDK is absent, `showRewardedAd()` resolves anyway and the sprite is delivered.
- **Vendor:** ayeT primary; **Google AdSense is the documented fallback** if Task 1's verification fails.
- **Env var convention:** build-time `VITE_*`, inlined by Bun (see `client/bunfig.toml`, `client/build.ts`, `client/package.json`). Read via `process.env.VITE_*`.
- **Pre-launch gates (NON-code, see final section):** ayeT ToS/format verification, a lawyer hour on the COPPA posture, neutralizing any "made for my students" framing on external marketing (it is **not** in this repo).

---

## File Structure

**Create:**
- `server/src/rate-limit.ts` — per-IP fixed-window limiter middleware + `__resetRateLimit()` test hook.
- `server/src/rate-limit.test.ts` — limiter unit + integration tests.
- `client/src/ads/ayet.ts` — ayeT SDK wrapper: `initAyet()`, `showRewardedAd(): Promise<AdResult>`.
- `client/src/ads/ayet.test.ts` — wrapper promise-semantics tests (fake SDK).
- `client/src/ads/runWithAdGate.ts` — pure coordination helper (await work + ad).
- `client/src/ads/runWithAdGate.test.ts` — gate ordering tests.
- `client/src/pages/PrivacyPage/PrivacyPage.tsx` + `PrivacyPage.test.tsx`.
- `client/src/pages/TermsPage/TermsPage.tsx` + `TermsPage.test.tsx`.
- `client/src/components/Footer/Footer.tsx` + `Footer.test.tsx`.

**Modify:**
- `server/src/config.ts` — add `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`.
- `server/src/app.ts` — mount the limiter on the two POST routes.
- `server/.env.example` — document the new env vars.
- `client/src/constants/ads.ts` — add ayeT constants.
- `client/.env.example` — add ayeT env vars.
- `client/index.html` — add the ayeT SDK `<script>`.
- `client/public/ads.txt` — add ayeT's authorized-seller line(s).
- `client/src/features/InputSection/hooks/useImageFileHandler.ts` — wrap the generate call in `runWithAdGate`.
- `client/src/components/LoadingOverlay.tsx` — remove the embedded display-ad box.
- `client/src/App.tsx` — call `initAyet()` once; add `/privacy` + `/terms` routes.
- `client/src/components/GenerationControls/GenerationControls.tsx` — drop the token branch; always render "Generate sprite".
- `client/src/pages/StudioPage/components/StudioNav.tsx` — remove the `★ {balance}` chip + `onOpenTokens`.
- `client/src/pages/HeroPage/HeroPage.tsx` — mount `<Footer />`.
- `client/src/providers/GlobalProviders.tsx` — remove `TokenProvider`.

**Delete (Task 5):** `client/src/context/TokenContext/` (`TokenContext.tsx`, `useToken.ts`), `client/src/pages/StudioPage/modals/TokenModal.tsx`.

**Optional retire (Task 9):** `client/src/components/AdComponents/SquareResponiveAd.tsx`, the AdSense `<script>`s in `index.html`, the Google line in `ads.txt`.

---

## Task 1: Set up the ayeT placement (USER ACTIONS — do this first, no code)

You have an ayeT account but no placement yet. This task is dashboard clicks + two verifications that decide whether ayeT works for Path B at all. **Nothing downstream needs the real IDs until Task 3**, so you can start Task 2 (server) in parallel.

- [ ] **Step 1: Create a Website placement.** ayeT dashboard → *Placements* → **Add Placement** → type **Website** → enter `makespritecode.com`. Copy the **Placement ID**.

- [ ] **Step 2: Add a Rewarded Video AdSlot.** Inside the placement → **Add AdSlot** → type **Rewarded Video** (NOT offerwall). Name it e.g. `generation-wait`. Copy the **AdSlot name/ID**.

- [ ] **Step 3: ⚠️ VERIFICATION A — on-demand-without-reward.** In the AdSlot/SDK docs ([HTML5 SDK](https://docs.ayetstudios.com/v/product-docs/rewarded-video/web-integrations/rewarded-video-sdk-for-html5)) confirm you can call `playFullscreenAd()` on demand and get paid for the view **without** wiring the S2S reward callback (Path B grants no token). If ayeT *requires* the reward callback to serve/pay, STOP and switch to the Google fallback (see Task 3 note) — record the outcome here.

- [ ] **Step 4: ⚠️ VERIFICATION B — child/mixed-audience traffic + non-personalized.** Read ayeT's **publisher Terms of Service** for any prohibition on child-directed / under-13 traffic, and confirm via the dashboard or support that **non-personalized / contextual serving** is supported and how to flag it (SDK param or dashboard toggle). If the ToS bans your traffic outright, that is a launch blocker → raise it with the lawyer (final section). Record the exact non-personalized flag name for Task 3.

- [ ] **Step 5: Turn OFF personalization; block categories.** In the placement settings set ads to **non-personalized**, and block at minimum: gambling, dating, alcohol, adult/mature, weight-loss. Confirm **no offerwall** AdSlot is enabled.

- [ ] **Step 6: Copy the ads.txt line(s).** The dashboard provides authorized-seller line(s) for ayeT — copy them verbatim for Task 3, Step 4.

- [ ] **Step 7: Record the IDs** somewhere you'll have them for Task 3 and for Render env config: Placement ID, AdSlot name, non-personalized flag, SDK script URL, ads.txt line(s).

---

## Task 2: Per-IP rate limit on the paid endpoints (server)

**Files:**
- Create: `server/src/rate-limit.ts`
- Create: `server/src/rate-limit.test.ts`
- Modify: `server/src/config.ts`
- Modify: `server/src/app.ts:30` (after the logging middleware)
- Modify: `server/.env.example`

**Interfaces:**
- Produces: `rateLimit(opts: { max: number; windowMs: number }): MiddlewareHandler` and `__resetRateLimit(): void` from `server/src/rate-limit.ts`.
- Consumes: `config.RATE_LIMIT_MAX`, `config.RATE_LIMIT_WINDOW_MS`.

- [ ] **Step 1: Write the failing unit tests.**

```ts
// server/src/rate-limit.test.ts
import { test, expect, describe } from "bun:test";
import { Hono } from "hono";
import { rateLimit, __resetRateLimit } from "./rate-limit";
import { app } from "./app";
import { config } from "./config";

describe("rateLimit middleware", () => {
  test("allows up to max requests then returns 429", async () => {
    __resetRateLimit();
    const a = new Hono();
    a.use("*", rateLimit({ max: 2, windowMs: 60_000 }));
    a.get("/", (c) => c.text("ok"));
    const headers = { "x-forwarded-for": "203.0.113.9" };
    expect((await a.request("/", { headers })).status).toBe(200);
    expect((await a.request("/", { headers })).status).toBe(200);
    const blocked = await a.request("/", { headers });
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ success: false, error: "Rate limit exceeded" });
  });

  test("separate IPs get separate buckets", async () => {
    __resetRateLimit();
    const a = new Hono();
    a.use("*", rateLimit({ max: 1, windowMs: 60_000 }));
    a.get("/", (c) => c.text("ok"));
    expect((await a.request("/", { headers: { "x-forwarded-for": "198.51.100.1" } })).status).toBe(200);
    expect((await a.request("/", { headers: { "x-forwarded-for": "198.51.100.2" } })).status).toBe(200);
  });
});

describe("app wiring", () => {
  test("generate route is rate-limited (last request 429s)", async () => {
    __resetRateLimit();
    const headers = { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.7" };
    const body = JSON.stringify({}); // invalid body → 422 until the limiter trips first
    let last = 0;
    for (let i = 0; i < config.RATE_LIMIT_MAX + 1; i++) {
      last = (await app.request("/generate-image/openai", { method: "POST", headers, body })).status;
    }
    expect(last).toBe(429);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail.**

Run: `cd server && bun test src/rate-limit.test.ts`
Expected: FAIL — `Cannot find module "./rate-limit"`.

- [ ] **Step 3: Implement the limiter.**

```ts
// server/src/rate-limit.ts
import type { Context, Next } from "hono";

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

/** Test-only: clear all buckets between tests. */
export function __resetRateLimit(): void {
  buckets.clear();
}

function clientIp(c: Context): string {
  const xff = c.req.header("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return c.req.header("x-real-ip") ?? "unknown";
}

export function rateLimit(opts: { max: number; windowMs: number }) {
  return async (c: Context, next: Next) => {
    const ip = clientIp(c);
    const now = Date.now();
    const bucket = buckets.get(ip);
    if (!bucket || now - bucket.windowStart >= opts.windowMs) {
      buckets.set(ip, { count: 1, windowStart: now });
      return next();
    }
    if (bucket.count >= opts.max) {
      return c.json({ success: false, error: "Rate limit exceeded" }, 429);
    }
    bucket.count += 1;
    return next();
  };
}
```

- [ ] **Step 4: Add config values.** In `server/src/config.ts`, inside the `config` object, add:

```ts
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 20,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
```

- [ ] **Step 5: Mount the limiter in `app.ts`.** Add the import at the top and, immediately after the logging middleware (`app.ts:29`), before `GET /`:

```ts
import { rateLimit } from "./rate-limit";
// ...after the logging middleware block:
const limiter = rateLimit({ max: config.RATE_LIMIT_MAX, windowMs: config.RATE_LIMIT_WINDOW_MS });
app.use("/generate-image/*", limiter);
app.use("/moderation/*", limiter);
```

- [ ] **Step 6: Document env vars** in `server/.env.example`:

```
# Per-IP rate limit on the paid endpoints (in-memory, resets on deploy)
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW_MS=60000
```

- [ ] **Step 7: Run the tests to verify they pass.**

Run: `cd server && bun test src/rate-limit.test.ts && bun run typecheck`
Expected: PASS, no type errors.

- [ ] **Step 8: Commit.**

```bash
git add server/src/rate-limit.ts server/src/rate-limit.test.ts server/src/config.ts server/src/app.ts server/.env.example
git commit -m "feat(server): per-IP rate limit on generate + moderate endpoints"
```

---

## Task 3: ayeT SDK wrapper + config + script + ads.txt (client)

**Files:**
- Create: `client/src/ads/ayet.ts`, `client/src/ads/ayet.test.ts`
- Modify: `client/src/constants/ads.ts`, `client/.env.example`, `client/index.html`, `client/public/ads.txt`

**Interfaces:**
- Produces: `type AdResult = "completed" | "closed" | "no_fill" | "error"`; `initAyet(): void`; `showRewardedAd(adslot?: string): Promise<AdResult>` from `client/src/ads/ayet.ts`. **Never rejects.**

> **Google fallback note:** if Task 1 Verification A failed, implement this module against Google AdSense/GPT instead — same exported interface (`initAyet`, `showRewardedAd`), so Tasks 4–8 are unchanged. Google web has no clean on-demand fullscreen video; the fallback shows the existing `SquareResponiveAd` display unit and resolves `showRewardedAd()` immediately (`"no_fill"`), keeping the soft gate a no-op.

- [ ] **Step 1: Add ayeT constants** to `client/src/constants/ads.ts`:

```ts
export const GOOGLE_AD_CLIENT_ID = process.env.VITE_GOOGLE_AD_CLIENT_ID;
export const SQUARE_AD_SLOT_ID = process.env.VITE_SQUARE_AD_SLOT_ID;

export const AYET_PLACEMENT_ID = process.env.VITE_AYET_PLACEMENT_ID ?? "";
export const AYET_ADSLOT = process.env.VITE_AYET_ADSLOT ?? "";
```

- [ ] **Step 2: Write the failing wrapper tests.**

```ts
// client/src/ads/ayet.test.ts
import { test, expect, describe, afterEach } from "bun:test";
import { showRewardedAd } from "./ayet";

type Cb = {
  onComplete?: () => void; onReward?: () => void;
  onClose?: () => void; onNoFill?: () => void; onError?: () => void;
};
function fakeSdk(play: (cb: Cb) => void) {
  (window as unknown as { AyetVideoSdk?: unknown }).AyetVideoSdk = {
    init: () => {}, requestAd: () => {}, playFullscreenAd: play,
  };
}

describe("showRewardedAd", () => {
  afterEach(() => { delete (window as unknown as { AyetVideoSdk?: unknown }).AyetVideoSdk; });

  test("resolves 'completed' on the reward/complete callback", async () => {
    fakeSdk((cb) => cb.onComplete?.());
    expect(await showRewardedAd("slot")).toBe("completed");
  });

  test("resolves 'closed' when the user closes the ad", async () => {
    fakeSdk((cb) => cb.onClose?.());
    expect(await showRewardedAd("slot")).toBe("closed");
  });

  test("resolves 'no_fill' when the SDK is absent (never blocks the user)", async () => {
    expect(await showRewardedAd("slot")).toBe("no_fill");
  });

  test("resolves 'error' if playFullscreenAd throws", async () => {
    fakeSdk(() => { throw new Error("boom"); });
    expect(await showRewardedAd("slot")).toBe("error");
  });
});
```

- [ ] **Step 3: Run to verify failure.**

Run: `cd client && bun test src/ads/ayet.test.ts`
Expected: FAIL — `Cannot find module "./ayet"`.

- [ ] **Step 4: Implement the wrapper.** (Confirm the real method/callback names against Task 1's docs; the public interface below stays the same regardless.)

```ts
// client/src/ads/ayet.ts
import { AYET_PLACEMENT_ID, AYET_ADSLOT } from "../constants/ads";

export type AdResult = "completed" | "closed" | "no_fill" | "error";

type AyetCallbacks = {
  onComplete?: () => void; onReward?: () => void;
  onClose?: () => void; onNoFill?: () => void; onError?: () => void;
};
type AyetSdk = {
  init: (placementId: string, externalId?: string, opts?: { nonPersonalized?: boolean }) => void;
  requestAd: (adslot: string) => void;
  playFullscreenAd: (cb: AyetCallbacks) => void;
};
function getSdk(): AyetSdk | undefined {
  return (window as unknown as { AyetVideoSdk?: AyetSdk }).AyetVideoSdk;
}

let initialized = false;

/** Idempotent; safe to call before the async SDK script has loaded (no-ops). */
export function initAyet(): void {
  if (initialized) return;
  const sdk = getSdk();
  if (!sdk) return; // try again on first showRewardedAd
  // NON-PERSONALIZED for everyone — blanket COPPA-safety posture.
  sdk.init(AYET_PLACEMENT_ID, undefined, { nonPersonalized: true });
  initialized = true;
}

/** Shows one fullscreen ad. Resolves on any terminal outcome; NEVER rejects. */
export function showRewardedAd(adslot: string = AYET_ADSLOT): Promise<AdResult> {
  return new Promise<AdResult>((resolve) => {
    initAyet();
    const sdk = getSdk();
    if (!sdk) { resolve("no_fill"); return; }
    let settled = false;
    const done = (r: AdResult) => { if (!settled) { settled = true; resolve(r); } };
    try {
      sdk.requestAd(adslot);
      sdk.playFullscreenAd({
        onReward: () => done("completed"),
        onComplete: () => done("completed"),
        onClose: () => done("closed"),
        onNoFill: () => done("no_fill"),
        onError: () => done("error"),
      });
    } catch {
      done("error");
    }
  });
}
```

- [ ] **Step 5: Run to verify pass.**

Run: `cd client && bun test src/ads/ayet.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Add env vars** to `client/.env.example`:

```
VITE_AYET_PLACEMENT_ID=
VITE_AYET_ADSLOT=
```

- [ ] **Step 7: Add the SDK script** to `client/index.html` `<head>` (use the real URL from Task 1):

```html
<!-- ayeT-Studios rewarded video SDK -->
<script async src="https://cdn.ayet.io/offerwall/js/ayetvideosdk.min.js"></script>
```

> **Security note (Subresource Integrity):** we intentionally do **not** add `integrity="sha384-…"` to this tag. Ad SDKs ship new builds to the same URL, so a pinned hash would break ad serving on every ayeT update (this is why the existing AdSense tags also omit SRI). The residual risk — trusting ayeT's CDN — is inherent to using an ad network. Mitigate by loading **only over HTTPS from the official ayeT CDN**, and prefer a **versioned URL** if ayeT publishes one. The wrapper already fails safe: if the SDK is absent or misbehaves, `showRewardedAd()` resolves and the user still gets their sprite.

- [ ] **Step 8: Add ayeT's ads.txt line(s)** to `client/public/ads.txt` (paste verbatim from Task 1, Step 6 — keep them on their own lines).

- [ ] **Step 9: Commit.**

```bash
git add client/src/ads/ayet.ts client/src/ads/ayet.test.ts client/src/constants/ads.ts client/.env.example client/index.html client/public/ads.txt
git commit -m "feat(client): ayeT rewarded-video SDK wrapper (non-personalized)"
```

---

## Task 4: Soft ad gate around the generation call (client)

**Files:**
- Create: `client/src/ads/runWithAdGate.ts`, `client/src/ads/runWithAdGate.test.ts`
- Modify: `client/src/features/InputSection/hooks/useImageFileHandler.ts:184-242`
- Modify: `client/src/components/LoadingOverlay.tsx` (remove the embedded ad box, lines ~78–85)
- Modify: `client/src/App.tsx` (warm up the SDK)

**Interfaces:**
- Produces: `runWithAdGate<T>(work: Promise<T>, showAd: () => Promise<unknown>): Promise<T>`.
- Consumes: `showRewardedAd` (Task 3).

- [ ] **Step 1: Write the failing gate tests.**

```ts
// client/src/ads/runWithAdGate.test.ts
import { test, expect, describe } from "bun:test";
import { runWithAdGate } from "./runWithAdGate";

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("runWithAdGate", () => {
  test("starts the ad immediately (concurrent with work)", async () => {
    let adStarted = false;
    await runWithAdGate(Promise.resolve("img"), () => { adStarted = true; return Promise.resolve(); });
    expect(adStarted).toBe(true);
  });

  test("does not resolve until BOTH the work and the ad settle", async () => {
    let adDone = false;
    const ad = tick(20).then(() => { adDone = true; });
    const result = await runWithAdGate(Promise.resolve("img"), () => ad);
    expect(adDone).toBe(true);      // ad finished before the gate resolved
    expect(result).toBe("img");     // returns the work's value
  });

  test("still returns the work value if the ad rejects (ad must never block delivery)", async () => {
    const result = await runWithAdGate(Promise.resolve("img"), () => Promise.reject(new Error("ad fail")));
    expect(result).toBe("img");
  });
});
```

- [ ] **Step 2: Run to verify failure.**

Run: `cd client && bun test src/ads/runWithAdGate.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper.**

```ts
// client/src/ads/runWithAdGate.ts
/**
 * Runs `work` and `showAd` concurrently, then resolves only once BOTH settle —
 * the soft "finish the ad to reveal your sprite" gate. The ad can never block
 * delivery: if it rejects, we swallow it and still return the work result.
 */
export async function runWithAdGate<T>(
  work: Promise<T>,
  showAd: () => Promise<unknown>,
): Promise<T> {
  const ad = showAd().catch(() => undefined); // ad failure must not reject
  const result = await work;
  await ad;
  return result;
}
```

- [ ] **Step 4: Run to verify pass.**

Run: `cd client && bun test src/ads/runWithAdGate.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Wire the gate into the generate hook.** In `client/src/features/InputSection/hooks/useImageFileHandler.ts`, add imports at the top:

```ts
import { runWithAdGate } from "../../../ads/runWithAdGate";
import { showRewardedAd } from "../../../ads/ayet";
```

Then change the generation call (currently `response = await generateOpenAiImage(openAISettings, { width, height }, palette);`) to gate the reveal behind the ad:

```ts
setGenerationMessage("Generating AI Image");
response = await runWithAdGate(
  generateOpenAiImage(openAISettings, { width, height }, palette),
  () => showRewardedAd(),
);
```

Everything after (`dataUrlToFile`, `setImportedImage`, `setSourceImage`, the `commit` branch, and `finally { stopGeneration() }`) stays as-is — it now runs only after the ad has finished.

- [ ] **Step 6: Remove the embedded display-ad box from the overlay.** In `client/src/components/LoadingOverlay.tsx`, delete the ad block (the `<div className="mt-6">…<SquareResponiveAd /></div>`, ~lines 78–85) and its `import SquareResponiveAd` (line 3). The ayeT ad is now a fullscreen takeover the SDK draws on top; the overlay just shows the spinner + message.

- [ ] **Step 7: Warm up the SDK once.** In `client/src/App.tsx`, add:

```ts
import { useEffect } from "react";
import { initAyet } from "./ads/ayet";
// inside App(), before the return:
useEffect(() => { initAyet(); }, []);
```

- [ ] **Step 8: Typecheck + full client test run.**

Run: `cd client && bun run typecheck && bun test`
Expected: PASS, no type errors.

- [ ] **Step 9: Manual verification (preview).** Start the app, enter a prompt, click Generate. Confirm: the overlay appears, the ayeT ad plays during the wait, and the sprite is **not revealed until the ad closes**. With `VITE_AYET_*` unset (no SDK), confirm generation still completes normally (no-fill path). Capture a screenshot.

- [ ] **Step 10: Commit.**

```bash
git add client/src/ads/runWithAdGate.ts client/src/ads/runWithAdGate.test.ts client/src/features/InputSection/hooks/useImageFileHandler.ts client/src/components/LoadingOverlay.tsx client/src/App.tsx
git commit -m "feat(client): soft ad gate — reveal sprite only after the ayeT ad finishes"
```

---

## Task 5: Remove the mock token UI (client)

**Files:**
- Modify: `client/src/components/GenerationControls/GenerationControls.tsx:90,154-173`
- Modify: `client/src/pages/StudioPage/components/StudioNav.tsx:3,12,28-35`
- Modify: `client/src/pages/StudioPage/StudioPage.tsx` (remove `onOpenTokens` + `TokenModal` wiring — grep to locate)
- Modify: `client/src/providers/GlobalProviders.tsx:14,31`
- Delete: `client/src/context/TokenContext/TokenContext.tsx`, `client/src/context/TokenContext/useToken.ts`, `client/src/pages/StudioPage/modals/TokenModal.tsx`

**Interfaces:** none produced. The deferred token spec is preserved in `CONTEXT.md` and ADR-0009; it will be rebuilt in the batch/animation PR.

- [ ] **Step 1: Write the failing test** for the always-on Generate button.

```tsx
// client/src/components/GenerationControls/GenerationControls.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import GenerationControls from "./GenerationControls";

describe("GenerationControls", () => {
  test("always offers Generate (no token gate)", () => {
    renderWithProviders(<GenerationControls />);
    expect(screen.getByRole("button", { name: /generate sprite/i })).toBeDefined();
    expect(screen.queryByText(/watch ad to earn a token/i)).toBeNull();
  });
});
```

> If `GenerationControls` requires props, pass the minimal valid set the component already expects (read its prop types at the top of the file) — do not invent props.

- [ ] **Step 2: Run to verify failure.**

Run: `cd client && bun test src/components/GenerationControls/GenerationControls.test.tsx`
Expected: FAIL (the "Watch ad to earn a token" branch still renders when the mock `canGenerate` is false — or passes spuriously; either way, proceed to make the code unconditional).

- [ ] **Step 3: Simplify `GenerationControls`.** Remove `import { useToken }` (line 11) and `const { canGenerate, watchAdToEarnToken } = useToken();` (line 90). Replace the `canGenerate ? (...) : (...)` ternary (lines 154–173) with the single button:

```tsx
return (
  <Button
    variant="primary"
    className="w-full"
    isLoading={isGenerating}
    onClick={handleGenerate}
  >
    ✦ Generate sprite
  </Button>
);
```

- [ ] **Step 4: Remove the token chip from `StudioNav`.** Delete the `useToken` import (line 3), `const { balance } = useToken();` (line 12), and the `★ {balance}` chip `<Button>` (lines 28–35). Remove `onOpenTokens` from the `Props` type and the function signature.

- [ ] **Step 5: Remove `onOpenTokens` + `TokenModal` from `StudioPage`.** Grep and delete the now-dead wiring:

Run: `cd client && grep -rn "onOpenTokens\|TokenModal\|useToken\|TokenProvider" src/`
Delete every hit (the `TokenModal` import + mount + the `onOpenTokens` prop passed to `StudioNav`).

- [ ] **Step 6: Remove the provider.** In `client/src/providers/GlobalProviders.tsx`, delete the `import { TokenProvider }` (line 14) and unwrap `<TokenProvider>` (line 31, keep its children).

- [ ] **Step 7: Delete the stub files.**

```bash
git rm client/src/context/TokenContext/TokenContext.tsx client/src/context/TokenContext/useToken.ts client/src/pages/StudioPage/modals/TokenModal.tsx
```

- [ ] **Step 8: Typecheck + tests (catch any straggler import).**

Run: `cd client && bun run typecheck && bun test`
Expected: PASS, no unresolved imports.

- [ ] **Step 9: Commit.**

```bash
git add -A
git commit -m "refactor(client): remove mock token UI (deferred to the credits PR)"
```

---

## Task 6: Privacy Policy page + route (client)

**Files:**
- Create: `client/src/pages/PrivacyPage/PrivacyPage.tsx`, `client/src/pages/PrivacyPage/PrivacyPage.test.tsx`
- Modify: `client/src/App.tsx` (add the route)

> **⚠️ The copy below is starter boilerplate, NOT legal advice — the lawyer hour in the final section must review it before launch.** It must disclose third-party ad cookies (ayeT) because ad networks require it.

- [ ] **Step 1: Write the failing render test.**

```tsx
// client/src/pages/PrivacyPage/PrivacyPage.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import PrivacyPage from "./PrivacyPage";

describe("PrivacyPage", () => {
  test("renders the heading and mentions advertising", () => {
    renderWithProviders(<MemoryRouter><PrivacyPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeDefined();
    expect(screen.getByText(/non-personalized/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify failure.**

Run: `cd client && bun test src/pages/PrivacyPage/PrivacyPage.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the page** (match the codebase's Tailwind class idiom; keep it a plain static document).

```tsx
// client/src/pages/PrivacyPage/PrivacyPage.tsx
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-ink">
      <h1 className="text-h2 font-bold">Privacy Policy</h1>
      <p className="mt-2 text-ink-subtle">Last updated: 2026-06-25</p>

      <h2 className="mt-6 text-h3 font-semibold">What we collect</h2>
      <p className="mt-2">
        MakeSpriteCode has no accounts and no login. We do not ask for your name,
        email, or any personal details to use the sprite generator. Prompts you
        submit are sent to our image provider solely to generate your sprite.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Advertising</h2>
      <p className="mt-2">
        A short video ad from ayeT-Studios may play while your sprite generates.
        We serve <strong>non-personalized (contextual) ads only</strong> — ads are
        not targeted to you based on a profile. Ad providers may set cookies or
        identifiers for frequency capping and fraud prevention. See ayeT-Studios'
        privacy policy for their practices.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Children</h2>
      <p className="mt-2">
        This is a general-audience tool. Because some visitors may be under 13, we
        serve non-personalized ads to everyone and do not knowingly collect personal
        information from children.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Contact</h2>
      <p className="mt-2">Questions: <a className="text-accent underline" href="mailto:CONTACT_EMAIL">CONTACT_EMAIL</a></p>
    </main>
  );
}
```

> Replace `CONTACT_EMAIL` with your real support address before launch.

- [ ] **Step 4: Add the route** in `client/src/App.tsx`, before the catch-all `<Route path="*" …>`:

```tsx
<Route path="/privacy" element={<PrivacyPage />} />
```

…with `import PrivacyPage from "./pages/PrivacyPage/PrivacyPage";` at the top.

- [ ] **Step 5: Run to verify pass + typecheck.**

Run: `cd client && bun test src/pages/PrivacyPage/PrivacyPage.test.tsx && bun run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add client/src/pages/PrivacyPage/ client/src/App.tsx
git commit -m "feat(client): privacy policy page + /privacy route"
```

---

## Task 7: Terms of Service page + route (client)

**Files:**
- Create: `client/src/pages/TermsPage/TermsPage.tsx`, `client/src/pages/TermsPage/TermsPage.test.tsx`
- Modify: `client/src/App.tsx`

> **⚠️ Starter boilerplate, not legal advice — lawyer review required.**

- [ ] **Step 1: Write the failing render test.**

```tsx
// client/src/pages/TermsPage/TermsPage.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import TermsPage from "./TermsPage";

describe("TermsPage", () => {
  test("renders the heading", () => {
    renderWithProviders(<MemoryRouter><TermsPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /terms of service/i })).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to verify failure.**

Run: `cd client && bun test src/pages/TermsPage/TermsPage.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the page.**

```tsx
// client/src/pages/TermsPage/TermsPage.tsx
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-ink">
      <h1 className="text-h2 font-bold">Terms of Service</h1>
      <p className="mt-2 text-ink-subtle">Last updated: 2026-06-25</p>

      <h2 className="mt-6 text-h3 font-semibold">Using MakeSpriteCode</h2>
      <p className="mt-2">
        MakeSpriteCode is a free tool for creating pixel-art sprites for MakeCode
        Arcade. Use it lawfully. Do not submit prompts that are illegal, hateful,
        sexual, or that infringe others' rights; prompts are screened and may be
        rejected.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Ads</h2>
      <p className="mt-2">
        Generation is supported by short, non-personalized video ads. Ad
        availability is not guaranteed and ads are provided by third parties.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">No warranty</h2>
      <p className="mt-2">
        The service is provided "as is", without warranties of any kind. Generated
        images may not be unique; you are responsible for how you use them.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Contact</h2>
      <p className="mt-2"><a className="text-accent underline" href="mailto:CONTACT_EMAIL">CONTACT_EMAIL</a></p>
    </main>
  );
}
```

- [ ] **Step 4: Add the route** in `App.tsx` before the catch-all:

```tsx
<Route path="/terms" element={<TermsPage />} />
```

…with `import TermsPage from "./pages/TermsPage/TermsPage";`.

- [ ] **Step 5: Run to verify pass + typecheck.**

Run: `cd client && bun test src/pages/TermsPage/TermsPage.test.tsx && bun run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit.**

```bash
git add client/src/pages/TermsPage/ client/src/App.tsx
git commit -m "feat(client): terms of service page + /terms route"
```

---

## Task 8: Global footer with legal links (client)

**Files:**
- Create: `client/src/components/Footer/Footer.tsx`, `client/src/components/Footer/Footer.test.tsx`
- Modify: `client/src/pages/HeroPage/HeroPage.tsx` (mount the footer)
- Modify: `client/src/pages/StudioPage/components/StudioNav.tsx` (add small Privacy/Terms links, since the editor has no footer)

**Interfaces:** Produces `<Footer />` (no props).

- [ ] **Step 1: Write the failing test.**

```tsx
// client/src/components/Footer/Footer.test.tsx
import { test, expect, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  test("links to /privacy and /terms", () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /privacy/i }).getAttribute("href")).toBe("/privacy");
    expect(screen.getByRole("link", { name: /terms/i }).getAttribute("href")).toBe("/terms");
  });
});
```

- [ ] **Step 2: Run to verify failure.**

Run: `cd client && bun test src/components/Footer/Footer.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the footer.**

```tsx
// client/src/components/Footer/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-raised px-4 py-6 text-center text-2xs text-ink-subtle">
      <nav className="flex items-center justify-center gap-4">
        <Link to="/privacy" className="hover:text-ink">Privacy</Link>
        <Link to="/terms" className="hover:text-ink">Terms</Link>
      </nav>
      <p className="mt-2">© MakeSpriteCode</p>
    </footer>
  );
}
```

- [ ] **Step 4: Mount on the hero page.** In `client/src/pages/HeroPage/HeroPage.tsx`, import `Footer` and render `<Footer />` as the last element of the page's root container.

- [ ] **Step 5: Add legal links to the studio nav** (the editor has no footer). In `StudioNav.tsx`, add to the header's right side:

```tsx
<Link to="/privacy" className="text-2xs text-ink-subtle hover:text-ink">Privacy</Link>
<Link to="/terms" className="text-2xs text-ink-subtle hover:text-ink">Terms</Link>
```

…with `import { Link } from "react-router-dom";` if not already present.

- [ ] **Step 6: Run to verify pass + typecheck + full suite.**

Run: `cd client && bun test && bun run typecheck`
Expected: PASS.

- [ ] **Step 7: Manual verification (preview).** Confirm the footer links work from the home page and the studio, and that `/privacy` and `/terms` render. Screenshot.

- [ ] **Step 8: Commit.**

```bash
git add client/src/components/Footer/ client/src/pages/HeroPage/HeroPage.tsx client/src/pages/StudioPage/components/StudioNav.tsx
git commit -m "feat(client): footer + studio nav links to privacy/terms"
```

---

## Task 9 (OPTIONAL, recommended): Retire the dormant AdSense integration

Going single-vendor + non-personalized is cleaner for the COPPA posture and removes a second tracker. **Reversible** — skip this task if you want to keep the existing ~$4/mo AdSense and revisit later. If kept, set AdSense to non-personalized too (Auto-ads → ad serving → non-personalized) to honor the global constraint.

- [ ] **Step 1: Remove the AdSense scripts** from `client/index.html` (the `adsbygoogle.js` tag ~line 39–43, the funding-choices + ad-blocking-recovery scripts ~line 44–50).
- [ ] **Step 2: Remove the Google line** from `client/public/ads.txt` (leave only ayeT's).
- [ ] **Step 3: Delete the now-unused files.**

```bash
git rm client/src/components/AdComponents/SquareResponiveAd.tsx
cd client && grep -rn "SquareResponiveAd\|adsbygoogle\|GOOGLE_AD_CLIENT_ID\|SQUARE_AD_SLOT_ID" src/ public/
```
Remove the AdSense constants from `client/src/constants/ads.ts` and the `VITE_GOOGLE_AD_CLIENT_ID` / `VITE_SQUARE_AD_SLOT_ID` lines from `client/.env.example` if no hits remain.

- [ ] **Step 4: Typecheck + tests + commit.**

```bash
cd client && bun run typecheck && bun test
git add -A && git commit -m "chore(client): retire dormant AdSense (single-vendor non-personalized)"
```

---

## Pre-launch checklist (NON-code — do before pointing real traffic at this)

These are gates, not tasks. The feature can be fully built and merged before they're all green, but **do not flip ayeT live for real users until they are.**

- [ ] **ayeT Verification A & B passed** (Task 1, Steps 3–4). If A failed → you're on the Google fallback. If B's ToS bans your traffic → blocker; resolve with the lawyer.
- [ ] **Lawyer hour** on the COPPA posture: confirm the mixed-audience + non-personalized-for-all stance against the *current* (recently amended) COPPA rule, and review the Privacy/Terms copy.
- [ ] **Neutralize "made for my students" framing** wherever it lives externally (site copy, social, app-store-style listings) — it is **not** in this repo. Keep the product framed general-audience.
- [ ] **Render env vars set** (API: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`; client build: `VITE_AYET_PLACEMENT_ID`, `VITE_AYET_ADSLOT`).
- [ ] **ads.txt deployed** at `https://makespritecode.com/ads.txt` with ayeT's line(s) (verify the live URL after deploy).
- [ ] **Non-personalized confirmed live**, category blocks on, **offerwall off** in the ayeT dashboard.
- [ ] **Real contact email** substituted into the Privacy + Terms pages.

---

## Self-Review

- **Spec coverage:** rate limit (T2) ✓ · ayeT integration + non-personalized (T1, T3) ✓ · soft gate (T4) ✓ · token UI removal (T5) ✓ · Privacy + Terms pages (T6, T7) ✓ · footer/links (T8) ✓ · no-DB/no-tokens constraint ✓ (nothing here persists) · drop kid-framing ✓ (moved to pre-launch — not in repo) · vendor fallback ✓ (T3 note) · lawyer/ToS gates ✓ (pre-launch).
- **Type consistency:** `AdResult` and `showRewardedAd`/`initAyet` defined in T3, consumed unchanged in T4 via `runWithAdGate`. `rateLimit`/`__resetRateLimit` defined + consumed in T2.
- **Deferred work captured:** the token economy (Turso + Drizzle + device ID + S2S callback) is recorded in `CONTEXT.md` (Monetization, deferred) and ADR-0009 for the future batch/animation PR.
