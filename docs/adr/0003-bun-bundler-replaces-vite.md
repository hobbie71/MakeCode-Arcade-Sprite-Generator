---
status: accepted
---

# All-Bun frontend toolchain — Bun's bundler replaces Vite

The frontend was a React 19 SPA built with Vite (HMR dev server, PostCSS/Tailwind/Sass pipeline). We replace Vite entirely with Bun's bundler and fullstack dev server, so the whole repo runs on a single toolchain (install, run, bundle, test all Bun). Current Bun has first-class React + Tailwind support, an HMR dev server via HTML imports, and `bun build` for static production output, so this is a supported path rather than a downgrade.

Recommendation at the time was to *keep* Vite (lower risk, zero user-visible gain from switching); the maintainer chose the single-toolchain path deliberately. Recorded because a future reader will otherwise assume Vite was the obvious choice and wonder why it was removed.

## Considered Options

- **Keep Vite, Bun only runs it** — lowest risk, mature SPA pipeline, but two bundlers in the repo and not "pure Bun".
- **Replace Vite with Bun's bundler** (chosen) — one toolchain end-to-end.

## Consequences

- `client/src/index.scss` (the only Sass file, imported once) must be converted to plain CSS: its `&` nesting is now native CSS, and its two Sass variables become CSS custom properties. Bun's lightningcss-based CSS bundler does not process `.scss`.
- The frontend build is now coupled to Bun — the same runtime lock-in deliberately avoided on the server by choosing Hono (ADR-0001). Accepted as an explicit trade for toolchain unity.
- Behavior/visual parity must be verified before cutover on a live app.
- Enables (but does not require) single-process fullstack serving via `Bun.serve` — deployment topology is decided separately.
