# Design docs

A complete redesign of the client (React 19 + TS, Bun bundler, Tailwind 3) into a modern, light-theme creative tool. Client-only: the server and the `shared/` wire contract are untouched, and the app stays stateless (no DB, no auth).

- **[ADR-0006](../adr/0006-client-ui-redesign.md)** — the locked design decisions and the *why* behind each (editor-centric two-process model, hybrid hero, studio shell, MakeCode-first export, light-theme tokens).
- **[ui-redesign-implementation-plan.md](ui-redesign-implementation-plan.md)** — the phased build plan: target architecture, file change map, build sequence, risks, and verification.
- **[redesign-mockup.html](redesign-mockup.html)** — the **locked visual mockup** (source of truth for look-and-feel). A self-contained "MakeSpriteCode" Claude Design export: React + Tailwind compiled in-browser via Babel, ~1.5 MB with all assets inlined. Open it locally (`python3 -m http.server` in this dir, then load `redesign-mockup.html`) to explore it live. Re-implemented on the real app architecture — **not** pasted in.
- **[design-tokens.reference.css](design-tokens.reference.css)** — the **68 light + 16 dark semantic CSS variables** extracted verbatim from the mockup (oklch color space, single indigo accent hue 264, Geist / Geist Mono / "Press Start 2P" type). Phase 1 translates these into `client/src/base.css`.
- **[visual-spec.md](visual-spec.md)** — per-screen component inventory captured from the mockup (hero, studio shell, the three modals), plus the small reconciliations between the mockup and the implementation plan.
- **[screenshots/](screenshots/)** — two sets:
  - `01-hero` … `07-modal-export` — reference captures of the **mockup** (hero tabs, studio, the three modals).
  - `impl-01-hero` … `impl-05-export` — captures of the **built app** (the redesign as implemented): hero, studio shell, and the Generate / Resize & Process / Export modals.

Execute the plan phase-by-phase, verifying each phase (build / lint / typecheck + a visual check) before moving on.
