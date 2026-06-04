# Design docs

A complete redesign of the client (React 19 + TS, Bun bundler, Tailwind 3) into a modern, light-theme creative tool. Client-only: the server and the `shared/` wire contract are untouched, and the app stays stateless (no DB, no auth).

- **[ADR-0006](../adr/0006-client-ui-redesign.md)** — the locked design decisions and the *why* behind each (editor-centric two-process model, hybrid hero, studio shell, MakeCode-first export, light-theme tokens).
- **[ui-redesign-implementation-plan.md](ui-redesign-implementation-plan.md)** — the phased build plan: target architecture, file change map, build sequence, risks, and verification.
- **redesign-mockup.tsx** *(added when the visual is captured)* — the locked visual mockup. Used as the source of truth for look-and-feel (colors, spacing, typography, components); re-implemented on the real app architecture, not pasted in.

Execute the plan phase-by-phase, verifying each phase (build / lint / typecheck + a visual check) before moving on.
