---
status: accepted
---

# Client UI redesigned around an editor-centric, two-process model

The client works but reads as amateur: it drops straight into a dense single screen — a cramped seven-section settings rail on the left, the editor in the middle, a tall always-on export section below the fold — with no framing of what the product is. We redesign the **entire client workflow and visual identity** (React 19 + TS, Bun bundler, Tailwind 3) into a modern, high-quality creative tool. This is a **client-only** change: the `server/` and the `shared/` Zod wire contract are untouched, and the app stays stateless/browser-only — no database, no auth. The decisions below were settled through a one-question-at-a-time design interview against the codebase; they are the target the implementation plan (`docs/design/ui-redesign-implementation-plan.md`) builds to.

## Decisions

1. **No database, no login, stateless.** The app stays browser-only. A visible UI slot is *reserved* for a future token balance (a rewarded "watch an ad to earn a token" economy), but no token logic is built now. Nothing in the design blocks a later server-signed stateless token (HMAC/JWT); the future ledger must be tamper-resistant rather than trusting raw cookie values. This was the pivotal unblock — a hero/landing page is just a static route, so it needs no backend, auth, or DB; expert-skip is a `hasVisited` flag.

2. **Editor-centric core; upload is first-class.** The product is image → MakeCode sprite → easy export. AI generation is the marquee/marketing feature, but uploading your own image is an equal first-class on-ramp, and a blank-canvas draw is also offered. This sets the information hierarchy: AI is the pitch, the editor and export are the product, and upload is a peer to AI — not a secondary option.

3. **Hybrid hero entry.** One landing page (`/`) that markets (value prop, example gallery, how-it-works) *and* lets you act immediately via an inline entry widget (prompt + "or upload" + size/asset-type). Returning users skip straight to `/studio` via a `hasVisited` flag. Chosen over both a pure-tool entry and a pure-marketing splash — it resolves "polished marketing surface" vs "experts shouldn't hit a splash every time" with no account system.

4. **The two-process model (sizing).** There are two distinct processes. **Generate** — the AI call (costs a token), *or* a free upload, *or* a blank canvas — produces a cached **source image**. **Process** — local, free, and re-runnable: remove-background → quantize to the MakeCode palette → crop/fit → scale to the target size. Generate/upload auto-processes once. Changing the canvas size does **not** auto-reprocess (it is CPU-heavy); "Resize" means **re-process at a new size** via a dedicated Resize & Process modal with an explicit Apply, operating on the cached source — so it is free and never costs a token. An always-visible **size chip** opens that modal, so a beginner on the default 16×16 can never get stuck.

5. **Studio shell: contextual bar + future dock.** The editor (`/studio`) keeps MakeCode-Arcade familiarity while adding room to grow: a left vertical tool rail (pencil, eraser, line, rect, circle, fill, select, pan + zoom controls + current-color chip); a contextual tool-options strip showing only the selected tool's options (pencil → brush size + pixel-perfect; fill → tolerance; shapes → fill/outline); a big central canvas on a light "stage" with a transparency checkerboard + pixel grid; floating action pills (`Generate` / `Resize & Process` / `Export`) plus the size chip and a display-only token chip; and a collapsible right dock (the palette today; reserved for future layers / animation frames / AI variations / history).

6. **MakeCode-first export modal.** Export becomes a modal led by a big primary "Copy for MakeCode" card — the `img` image-literal with a copy button, a sprite preview, and a "click in MakeCode, then Ctrl+V" hint. Secondary: PNG / JPEG / WEBP. Tertiary: JavaScript / Python. The most common real action is pasting an `img` literal into MakeCode Arcade, so the design makes that the loud primary path instead of four equal formats with no guidance.

7. **Clean light SaaS, single theme, token-ready.** Visual direction: clean, bright, modern light-theme SaaS — airy whitespace, rounded cards, soft shadows, one confident accent, crisp sans-serif, strong hierarchy (references: Notion, Recraft, Linear, Figma), with tasteful, non-gimmicky pixel/arcade accents. A single theme ships now, but built entirely on semantic CSS-variable design tokens (surface / text / accent / border / state / canvas-stage / shadow / radius) declared as `:root` light values plus a `[data-theme="dark"]` stub, so a light/dark toggle is later a config flip. Components must never hardcode colors.

## Considered Options

- **Pure-tool entry vs pure-marketing splash vs hybrid hero** — pure-tool gives no framing/SEO; a forced splash punishes returning experts. The hybrid hero (chosen) markets and acts in one route, with a `hasVisited` skip.
- **Live re-processing vs commit-to-reprocess** — auto-reprocessing on every size change is CPU-heavy and would (in the future model) risk burning tokens. A deliberate, modal "Resize & Process" with explicit Apply on a cached source (chosen) keeps re-sizing free and predictable.
- **Keep the MakeCode-style fixed toolbar vs a richer custom shell** — the chosen "contextual bar + future dock" keeps MakeCode muscle memory (tools-left, big canvas, floating buttons) while de-cluttering the toolbar and reserving explicit room to grow.
- **Ship dark now / ship light-only / light-now-token-ready** — light-now on a semantic token system (chosen) locks the aesthetic while making the future dark mode a config flip, not a rewrite.

## Consequences

- **Phase 1 flips the live theme from today's dark to the new light theme.** Moving every component off the old `default-*` / `text-default-*` scale onto semantic tokens is the bulk of the foundational work.
- Adds client-side routing (`react-router-dom`, component API). All three serve paths already do SPA fallback, so no build/serve changes are needed.
- Providers split into `GlobalProviders` (state that must survive hero→studio navigation) and editor-local contexts; a `TokenContext` stub and a cached `sourceImage` (which enables free re-processing) are added.
- The token-balance chip and the "watch an ad to earn a token" state are display-only placeholders. The real rewarded-video + token-ledger work is tracked separately and is out of scope for this redesign.
- Server and `shared/` are untouched; the wire contract does not change.
