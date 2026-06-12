# Home Page Motion Redesign

**Date:** 2026-06-11
**Branch:** `ui-redesign`
**Status:** Approved — ready for implementation plan

## Problem

The home page (`pages/HeroPage/HeroPage.tsx`) markets the product but feels static
and unfinished in two spots:

- **`ExampleGallery`** renders nine placeholder color squares, not real sprites.
  The component comment already flags them as stand-ins to "swap for real
  generated-sprite assets later."
- **`HowItWorks`** explains the three steps in text-only cards. It *tells* the user
  what happens; it never *shows* it.

Meanwhile a polished Remotion-rendered demo (`export-demo.webm/.mp4/.gif`) already
exists but is buried — it only appears inside the studio's `ExportModal`, never on
the marketing page.

The goal: make the home page feel alive and cool — something a visitor screenshots —
**without** motion-for-motion's-sake. The reference is family.co: every animation is
a *demonstration*, each section proves one promise by showing it happening.

## Scope

- **Client home page only** (`pages/HeroPage/`) plus the Remotion project at
  `~/Documents/Coding/makespritecode-export-gif` that renders the video artifacts.
- **No** changes to the studio, the server, the wire contract, or the generation
  flow. This is a marketing-surface + motion-asset effort.
- Real sprite assets for the gallery are produced by the user (out of band) and
  dropped into the existing gallery component.

## Guiding principle

**One section = one benefit + one obvious demo of that exact benefit.** Borrowed
directly from family.co. The page becomes a vertical sequence: a flagship hero loop
greets the visitor, then alternating left/right demo sections each prove a single
promise (describe → refine → ship), then a real-sprite gallery, then the CTA. The
alternating rhythm keeps a long motion page from reading as a wall of videos.

## Motion mechanism — loop on reveal

All motion is **pre-rendered Remotion video** that autoplays, muted, and loops when
its section scrolls into view. This deliberately is *not* scroll-scrubbed animation
(the literal family.co mechanic); loop-on-reveal delivers ~90% of the feel while
reusing 100% of the existing Remotion kit and avoiding a bespoke web-animation
engine. Each clip is short (target 4–8s) and authored to loop seamlessly (first
frame ≈ last frame).

A scroll-scrubbed upgrade for *just the hero* is a possible future enhancement; it is
out of scope here.

## Current architecture (as found)

### Client
- **`pages/HeroPage/HeroPage.tsx`** — composes: sticky nav → hero (`HeroEntryWidget`)
  → `ExampleGallery` → `HowItWorks` → CTA → footer.
- **`pages/HeroPage/components/HowItWorks.tsx`** — a `STEPS` array of three
  `{n, title, body, icon}` rendered as text cards. This component is replaced.
- **`pages/HeroPage/components/ExampleGallery.tsx`** — an `EXAMPLES` array of
  placeholder `{label, color, size}` squares. The layout (tile + label/size-badge
  row) stays; only the tile contents change in phase 3.
- **`client/public/`** — already holds `export-demo.webm/.mp4/.gif`. Static assets
  here are served at the site root (referenced as `/export-demo.webm`). This is the
  drop target for all new rendered clips + posters.

### Remotion project (`~/Documents/Coding/makespritecode-export-gif`)
- **`src/Root.tsx`** — registers one `Composition`: `ExportFlowDemo`
  (705 frames @ 30fps ≈ 23.5s, 1280×720).
- **Reusable components:** `Cursor`, `MakeCodeChrome`, `BrowserFrame`, `fabric`,
  `ImageEditor`, `PixelSprite`, `Caption`, `Simulator`.
- **Scenes:** `SceneCopy`, `SceneJs`, `SceneMakeCode`.
- **Scripts:** `dev` (remotion studio), `build` (remotion bundle). Rendering uses the
  Remotion CLI (`remotion render <id> <out>`); the existing `out/` holds the rendered
  `export-demo.*`.

The kit needed to build every new clip already exists. The work is composing new,
shorter, loop-friendly compositions from these pieces and wiring video playback into
the home page.

## Target page structure

```
Nav
Hero            headline + live generate widget   |   HERO LOOP (prompt → sprite → game)   ← phase 1
Describe it     "Type it, watch it appear"        |   clip: prompt types, pixels assemble  ← phase 2
Refine it       clip: painting, palette swap      |   "Tune every single pixel"            ← phase 2 (reversed)
Ship it         "Paste straight into MakeCode"    |   clip: copy → paste → runs in a game   ← phase 2
Gallery         real sprites (user-provided)                                                ← phase 3
CTA
Footer
```

## Design

### New client component: `DemoClip`

`pages/HeroPage/components/DemoClip.tsx` — the single reusable motion primitive.

- Renders a `<video muted loop playsInline preload="metadata">` with `<source>` for
  webm then mp4, and a `poster` (first-frame PNG) so the section paints instantly
  before the video is ready.
- **Play on reveal:** an `IntersectionObserver` plays the video when ≥some threshold
  of it is on-screen and pauses it when it leaves (saves battery/CPU on a long page).
- **Reduced motion:** when `matchMedia("(prefers-reduced-motion: reduce)")` matches,
  do not autoplay — render the poster image only. The adjacent headline already
  conveys the meaning in text.
- Props: `{ src: string (basename, e.g. "demo-describe"), poster: string,
  aspect?: string, label: string }`. `label` feeds an `aria-label` / visually-hidden
  description for screen readers.
- Below-the-fold instances lazy-load (the observer drives `src` assignment, or
  `preload="none"` until first reveal) so the page's initial payload stays light.

### New client component: `DemoSection`

`pages/HeroPage/components/DemoSection.tsx` — one benefit row.

- Props: `{ eyebrow, title, clip: DemoClipProps, reversed?: boolean }`.
- Two-column on desktop (text + `DemoClip`), stacks on mobile. `reversed` flips the
  column order for the alternating rhythm.
- Rendered three times in `HeroPage` (Describe, Refine, Ship), with `reversed` on the
  middle one. Replaces `HowItWorks` entirely (the `STEPS` copy migrates into these
  three `DemoSection`s).

### `HeroPage` changes

1. **Hero:** add the hero `DemoClip` beside the existing `HeroEntryWidget` (or
   directly under it on narrow screens). The widget and its behavior are unchanged.
2. **Replace `HowItWorks`** with three `DemoSection`s.
3. **`ExampleGallery`** (phase 3): swap placeholder squares for real sprite assets;
   keep the existing tile + label/size-badge layout.
4. Nav, CTA, footer unchanged.

### Remotion compositions

Add to `src/Root.tsx`, each authored short and loop-seamless:

- **`HeroLoop`** *(phase 1)* — the whole arc condensed: prompt → sprite materializes →
  paste into MakeCode → runs in a game. ~6–10s. Reuses `SceneMakeCode`/`Simulator`/
  `PixelSprite`/`Cursor`.
- **`StepDescribe`** *(phase 2)* — prompt typing in, then pixels assembling into a
  sprite. `Caption` + `PixelSprite` + `Cursor`.
- **`StepRefine`** *(phase 2)* — the pixel editor: painting strokes, a palette-color
  swap. `ImageEditor` + `Cursor` + `PixelSprite`.
- **`StepShip`** *(phase 2)* — copy the `img` literal → paste into MakeCode → sprite
  runs. This is effectively the existing `ExportFlowDemo` (`SceneCopy` +
  `SceneMakeCode` + `Simulator`), retrimmed to a tight loop. Reuse, don't rebuild.

### Render → ship pipeline

For each composition: render `webm` (VP9, small) + `mp4` (H.264, Safari/iOS
fallback) + a first-frame `poster.png`, then copy all three into `client/public/`
with a stable basename (`demo-hero.*`, `demo-describe.*`, `demo-refine.*`,
`demo-ship.*`). This mirrors how `export-demo.*` already lives in `public/`. A small
render-and-copy npm script in the Remotion project keeps this repeatable.

## Phasing

Each phase is independently shippable; the page looks better after every one.

- **Phase 1 — Hero loop.** Build `DemoClip`, render `HeroLoop`, place it in the hero.
  This alone transforms the page. Complete, shippable win.
- **Phase 2 — Step demos.** Build `DemoSection`, render `StepDescribe` / `StepRefine`
  / `StepShip`, replace `HowItWorks` with the three alternating sections.
- **Phase 3 — Real gallery.** Drop user-provided real sprite assets into
  `ExampleGallery`, replacing the placeholder squares. Optional light motion later.

## Edge cases & notes

- **Performance.** Keep each webm small (the existing 23.5s export webm is ~719KB —
  the new 4–8s clips should be well under that). Posters paint immediately; off-screen
  videos stay paused; below-the-fold clips don't preload. Total initial weight should
  stay modest despite five videos.
- **Accessibility.** `prefers-reduced-motion: reduce` → posters only, no autoplay.
  Every clip carries a text description; the section headline states the benefit in
  words regardless of motion.
- **Autoplay rules.** Videos must be `muted` + `playsInline` to autoplay on
  mobile/Safari; both are baked into `DemoClip`.
- **Visual consistency.** All clips share the Remotion kit (`Cursor`,
  `MakeCodeChrome`, `PixelSprite`, `Simulator`, `theme.ts`), so the five videos read
  as one coherent system — the thing that makes family.co feel intentional rather
  than busy.
- **Two-repo workflow.** Compositions live in the Remotion project; only the rendered
  artifacts (webm/mp4/poster) cross into `client/public/`. The client never imports
  Remotion.
- **GIF.** Not needed for the home page (video + poster covers it). The `.gif`
  variant remains only where it's already used.

## Out of scope

- Scroll-scrubbed / scroll-linked animation (the literal family.co mechanic) for any
  section, including a future hero upgrade.
- Any studio, server, wire-contract, or generation-flow change.
- Producing the real sprite art for the gallery (user supplies it).
- Sound. All clips are silent.
- A client test suite (none exists; server-only tests).
