# Frontend style guide

The visual identity for the MakeSpriteCode client. Derived from the locked redesign
mockup (`docs/design/redesign-mockup.html`); see `docs/design/` for the full design
docs, the verbatim token reference, and per-screen screenshots.

**Direction:** clean, bright, modern **light-theme SaaS** — airy whitespace, rounded
cards, soft shadows, one confident **indigo accent**, crisp **Geist** sans-serif, strong
hierarchy, with tasteful (non-gimmicky) pixel/arcade accents.

## The one rule

**Never hardcode colors, shadows, radii, or fonts in components.** Everything is a
semantic design token. Use the Tailwind utilities below (or `var(--token)` directly).
This is what makes the light→dark flip a single attribute change.

## Tokens live in two places

1. **`src/base.css`** — the source of truth: CSS custom properties on `:root`
   (= light) and `[data-theme="dark"]` (the dark overrides). Color space is **oklch**;
   one accent hue (`--accent-h: 264`) threads through accent, surfaces, text, borders
   and shadows — change it to retheme.
2. **`tailwind.config.js`** — maps those vars to Tailwind utility names (below). Never
   put raw color values here; only `var(--token)` references.

`tailwind.gen.css` is **generated** by `bun run css:build` — never edit it.

## Color utilities

| Purpose | Utility | Token |
|---|---|---|
| App background | `bg-surface` | `--surface` |
| Cards / raised | `bg-surface-raised` | `--surface-raised` |
| Sunken / inset | `bg-surface-sunken` | `--surface-sunken` |
| Hover fill | `bg-surface-hover` | `--surface-hover` |
| Canvas backdrop | `bg-stage` | `--canvas-stage` |
| Primary text | `text-ink` | `--text` |
| Secondary text | `text-ink-muted` | `--text-muted` |
| Tertiary text | `text-ink-subtle` | `--text-subtle` |
| Text on accent | `text-on-accent` | `--text-on-accent` |
| Accent (brand) | `bg-accent` `text-accent` `border-accent` | `--accent` |
| Accent hover/press | `bg-accent-hover` `bg-accent-press` | `--accent-hover` / `-press` |
| Accent tints | `bg-accent-soft` `bg-accent-soft-2` | `--accent-soft` / `-soft-2` |
| Accent ring/border | `ring-accent-ring` `border-accent-border` | `--accent-ring` / `-border` |
| Borders | `border-line` `border-line-strong` `border-line-faint` | `--border*` |
| State | `bg-success` `bg-warning` `bg-danger` `bg-info` (+ `-soft`) | `--success` … |
| Checkerboard | the `.transparent` class (in base.css) | `--checker-a/-b` |

## Typography

- **Sans (everything):** `font-sans` → Geist. **Mono (code):** `font-mono` → Geist Mono.
  **Pixel accent (logo/arcade flourishes only):** `font-pixel` → "Press Start 2P".
- Display/heading sizes: `text-display` (hero), `text-h1`…`text-h4`, `text-body-lg`.
  Tailwind's `text-sm`/`text-base`/`text-xl` etc. remain available for body/UI.
- Webfonts are loaded via `<link>` in `index.html`.

## Shape, depth, motion

- **Radii:** `rounded-chip` (12px), `rounded-card` (16px), `rounded-modal` (22px),
  `rounded-pill`. Tailwind defaults (`rounded-md`/`-lg`) still work.
- **Shadows:** `shadow-xs/sm/md/lg` (branded, accent-tinted neutrals) and
  `shadow-accent` (for primary buttons). `shadow-sm/md/lg` override Tailwind's defaults.
- **Spacing:** Tailwind's default 4px scale already matches the mockup's `--sp-*`.
- **Easing:** `var(--ease)` / `var(--ease-out)` for custom transitions.

## Dark mode

Ships light only, but is fully wired: set `document.documentElement.dataset.theme =
"dark"` and the whole app flips via the tokens (verified). A toggle is future work.

## Shared component classes

`src/tailwind.src.css` defines reusable `@layer components` classes (`heading-*`,
`btn`/`btn-primary`/`btn-secondary`/`btn-danger`, `card*`, `form-*`, `tab-*`,
`tool-button`, `color-swatch`, …), all built on the tokens above. Prefer composing
these (or raw token utilities) over ad-hoc styling.

The whole client is on the semantic token system — there are no legacy color
aliases. Every component reads colors/shadows/radii/fonts from the tokens above.
