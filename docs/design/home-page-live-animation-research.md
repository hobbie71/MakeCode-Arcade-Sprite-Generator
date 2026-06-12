# Home Page Premium Animation — Research Notes

**Date:** 2026-06-11
**Status:** Preliminary / to consider — NOT decided. More research planned.
**Relates to:** [`docs/superpowers/specs/2026-06-11-home-page-motion-redesign-design.md`](../superpowers/specs/2026-06-11-home-page-motion-redesign-design.md)

## Why this note exists

The approved motion-redesign spec uses **pre-rendered Remotion video** played back
via a `<video>` tag ("loop on reveal"). That's the fast, low-effort first pass.

The reference site we love — **family.co** — does *not* do this. You can't pause or
scrub its animations because they aren't videos: they're **live, code-driven
animation running in the browser in real time** (the "row 2" approach). This note
captures research on how to do *that* properly, for the eventual "make it a lot
nicer" version. Treat it as a starting point, not a plan.

## The three ways to put motion on a page (for context)

| Mechanism | What it is | Pausable? | Crispness |
|---|---|---|---|
| Pre-rendered video (`<video>`) — *current spec* | A recorded file plays back | Yes | Soft (compressed) |
| **Live DOM/SVG animation** (GSAP, Framer Motion) — *family.co* | Real elements animated by code, scroll-linked | No | Razor sharp |
| Canvas / WebGL / image-sequence (Three.js, Apple-style) | Frames drawn live, scroll-driven | No | Razor sharp |

family.co is row 2 (and sometimes row 3). The current spec is row 1.

## Key finding: Remotion CAN do row 2 (this changes the calculus)

Remotion is not only a video exporter. The **`@remotion/player`** package renders
the *same composition* you'd export to video as **live React DOM/SVG in the browser,
in real time** — no video file.

- `<Player>` exposes an imperative ref: `seekTo(frame)`, `play()`, `pause()`,
  `getCurrentFrame()`, `isPlaying()`, etc.
- You can **drive the frame from scroll position**: scroll listener → compute target
  frame → `playerRef.seekTo(frame)`. That's scroll-scrubbing, but the thing being
  scrubbed is our React pixel-art scene, not a flat video.
- **Implication:** we can reach the live/scroll-driven feel **while reusing the
  Remotion compositions we already know how to author** — instead of rebuilding
  everything in another animation library.

Caveats from Remotion's docs:
- The Player re-renders the React tree per frame (`useCurrentFrame`), heavier than
  hand-tuned CSS transforms. Fine for sprite `div`s; avoid deep nesting.
- Prefer a throttled `timeupdate`-style read over reacting to every `seeked` event if
  rerenders get heavy.
- Autoplay needs a user gesture or a passed `SyntheticEvent` (same rule as `<video>`).

Sources: [Remotion Player](https://www.remotion.dev/docs/player/) ·
[Player API](https://www.remotion.dev/docs/player/player)

## What the pros use (family.co tier)

Remarkably consistent across award-winning sites:

| Layer | Tool | Role |
|---|---|---|
| Smooth scroll | **Lenis** (darkroomengineering, ex-Studio Freight) | Interpolated buttery scroll; powers family.co's feel + seamless infinite loop |
| Scroll-linked animation | **GSAP + ScrollTrigger** | Industry standard. `scrub` ties progress to scroll; `pin` freezes a section while it plays; synced to Lenis via `gsap.ticker` |
| React-native option | **Framer Motion** (`useScroll`/`useTransform`) | Spring-physics scroll animation, stays in React idioms |
| Cinematic / heavy | **Canvas image-sequence** (Apple-style) or **WebGL / React Three Fiber** | Preload frames → draw to `<canvas>` by scroll progress; or full 3D |
| Vector characters | **Rive** / **Lottie** | Designer-authored, state-/scroll-driven, razor sharp — promising for animated sprites |
| Emerging, no-JS | **CSS scroll-driven animations** (`animation-timeline: scroll()`) | Native reveals/parallax, zero JS |

The recurring "magic": **Lenis + GSAP synced to one clock** so scroll and animation
never jank. Common techniques: scroll-triggered reveals, parallax, section pinning,
staggered reveals, duplicate-first-section infinite loop.

Sources: [Lenis](https://github.com/darkroomengineering/lenis) ·
[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) ·
[Codrops: Lenis+GSAP infinite scroll](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/) ·
[CSS-Tricks: Apple-style scroll](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/) ·
[React scroll libraries 2025](https://zoer.ai/posts/zoer/best-react-scroll-animation-libraries-2025)

## Two realistic "do it right" paths

1. **Remotion `<Player>` + Lenis** — keep authoring scenes in Remotion, render them
   *live* with `<Player>`, add Lenis for smooth scroll, and a thin scroll→`seekTo`
   mapper for scrubbing. Best ROI given the compositions already exist and we know the
   tool. Can graduate individual show-stopper sections to hand-rolled GSAP later.
2. **Lenis + GSAP ScrollTrigger** — the literal family.co recipe. Most control and
   truest match, but rebuilds the animations outside Remotion.

**Current lean (not a decision):** Path 1, because it reuses existing Remotion work
while still being genuinely live/scroll-driven.

## Open questions to research later

- Does `@remotion/player` scroll-scrubbing stay smooth with our pixel-art scenes
  (many `div`s), or do we need to cap sprite cell counts / memoize? Build a throwaway
  prototype and measure.
- Lenis + Remotion Player integration: who owns the rAF loop? Does Lenis's scroll
  value feed `seekTo` cleanly, or do they fight? (Lenis normally syncs with
  `gsap.ticker` + `ScrollTrigger.update` — what's the equivalent with the Player?)
- Is the Player's per-frame React rerender acceptable for *continuous ambient* motion
  (not just scrub), or should ambient loops stay as lightweight CSS/GSAP and only the
  hero be Player-driven?
- What does family.co *actually* use? Confirm by inspecting (DevTools, network, no
  `<video>` tags) rather than assuming — and check whether it's a Framer-built site.
- Pixel-art crispness: confirm `image-rendering: pixelated` holds through whatever
  transform/scale the Player applies.
- Accessibility: how does `prefers-reduced-motion` map onto scroll-scrubbed content
  (disable scrub + show a static frame?).
- Bundle cost: `@remotion/player` + Lenis + GSAP weight vs. the current zero-runtime
  video approach. Is it worth it on a free, ad-supported page?
- Mobile: scroll-scrubbing UX on touch — does it feel good, or should mobile fall back
  to autoplay loops / posters?

## Bottom line

The current spec (baked video) is the right *baseline*. The premium version is row-2
live animation, and the non-obvious unlock is that **Remotion can do row 2 via
`@remotion/player`** — so we likely don't have to abandon the Remotion investment to
get the family.co feel. Decide after a measurement prototype.
