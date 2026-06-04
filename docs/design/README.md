# Design docs

A complete redesign of the client (React 19 + TS, Bun bundler, Tailwind 3) into a modern, light-theme creative tool. Client-only: the server and the `shared/` wire contract are untouched, and the app stays stateless (no DB, no auth).

- **[ADR-0006](../adr/0006-client-ui-redesign.md)** — the locked design decisions and the *why* behind each (editor-centric two-process model, hybrid hero, studio shell, MakeCode-first export, light-theme tokens).
- **[ui-redesign-implementation-plan.md](ui-redesign-implementation-plan.md)** — the phased build plan: target architecture, file change map, build sequence, risks, and verification.
- **[redesign-mockup.html](redesign-mockup.html)** — the **locked visual mockup** (source of truth for look-and-feel). A self-contained "MakeSpriteCode" Claude Design export: React + Tailwind compiled in-browser via Babel, ~1.5 MB with all assets inlined. Open it locally (`python3 -m http.server` in this dir, then load `redesign-mockup.html`) to explore it live. Re-implemented on the real app architecture — **not** pasted in.
- **[design-tokens.reference.css](design-tokens.reference.css)** — the **68 light + 16 dark semantic CSS variables** extracted verbatim from the mockup (oklch color space, single indigo accent hue 264, Geist / Geist Mono / "Press Start 2P" type). Phase 1 translates these into `client/src/base.css`.
- **[visual-spec.md](visual-spec.md)** — per-screen component inventory captured from the mockup (hero, studio shell, the three modals), plus the small reconciliations between the mockup and the implementation plan.
- **[screenshots/](screenshots/)** — reference captures of every key state of the mockup: `01-hero` (full page), `02-hero-upload`, `03-hero-draw`, `04-studio`, `05-modal-generate`, `06-modal-resize`, `07-modal-export`.

Execute the plan phase-by-phase, verifying each phase (build / lint / typecheck + a visual check) before moving on.
