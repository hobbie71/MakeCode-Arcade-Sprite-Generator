# Visual spec — captured from the locked mockup

Component inventory of `redesign-mockup.html` (the "MakeSpriteCode" Claude Design export),
captured state-by-state from `screenshots/`. This is the bridge between the visual source of
truth and the [implementation plan](ui-redesign-implementation-plan.md). Exact color / type /
spacing / shape values live in [design-tokens.reference.css](design-tokens.reference.css).

## Visual identity (from computed styles)

- **Color space: oklch.** One accent hue (`--accent-h: 264`, an indigo-blue) threads through accent, surfaces, text, borders and shadows. The live accent is `oklch(0.58 0.18 264)` (a vivid indigo `#4F5BD5`-ish), **not** the washed-out periwinkle the claude.ai overlay showed.
- **Type:** `Geist` (sans, body + headings), `Geist Mono` (code), `"Press Start 2P"` (pixel accent — logo/arcade flourishes only). Display heading ~68px / weight 720 / tight `-2.38px` tracking.
- **Surfaces:** near-white app bg `--surface` (oklch 0.985), pure-white raised cards `--surface-raised`, light-gray canvas stage `--canvas-stage` (oklch 0.95).
- **Shape:** radii 6/9/12/16/22px + pill; soft accent-tinted shadows (`--shadow-sm/md/lg`, `--shadow-accent` on primary buttons).

## Hero (`/`) — `01-hero`, `02-hero-upload`, `03-hero-draw`

- **Top nav:** pixel-sprite logo + "MakeSprite**Code**" (accent on "Code"); links Features / Gallery / How it works; a small palette/theme icon; filled accent **Open Studio →** button.
- **Hero left:** display heading "Turn any image into a **MakeCode sprite**" (accent on last line); supporting paragraph; three check-rows in white pills (Completely free / No account needed / Paste into MakeCode Arcade).
- **Entry widget (right card):** segmented tabs **AI Generate / Upload Image / Draw Blank**.
  - *AI Generate:* prompt textarea (detailed placeholder) + Asset type + Size selects + accent **Generate sprite** button; footer "★ 1 token per generation · ~6s · powered by GPT-Image".
  - *Upload Image:* dashed drag-&-drop zone ("Drag & drop an image / or **browse files** · PNG, JPG, WEBP up to 10MB") + Asset type + Size + **Process image** button.
  - *Draw Blank:* "Canvas size" preset chips (8/16/24/32…) + Asset type + **Start with blank canvas** button.
- **Below the fold:** "A gallery of generated sprites" showcase grid (sprites on transparency checkerboards) + "Explore the showcase"; "From idea to game in three steps" (Describe or upload → Edit & refine → Copy into MakeCode); centered "Open the studio — it's free" CTA; footer.

## Studio (`/studio`) — `04-studio`

- **Top bar:** logo · "Untitled sprite / saved locally" · right: **★ 3** token chip (display-only, reserved slot) · accent **Export** button.
- **Tool-options strip** (contextual, under top bar): for Pencil → "Pencil" label · Brush · stroke sizes **1px 2px 3px 5px**. Changes per selected tool.
- **Left rail (vertical):** pencil (active), eraser, line, rectangle, ellipse, fill, move/pan, eyedropper, zoom-in, zoom-out, fit, grid toggle. Selected tool gets accent fill.
- **Canvas stage:** light-gray stage, sprite on transparency checkerboard with pixel grid; a "● Blue" current-color pill top-left; undo/redo top-right.
- **Floating action layer (bottom):** size chip **▦ 32 × 32** (bottom-left) · pills **✦ Generate** (accent) / **⟲ Resize & Process** / **⎙ Export** (center) · zoom **100%** (bottom-right).
- **Right dock (collapsible):** tabbed; first tab **Palette** with an "Arcade" palette dropdown, the 16-swatch Arcade grid, and the selected-swatch readout ("Blue · index 8 · #003FAD"); second tab **Source** with the cached source image on a checkerboard, ghost-overlay controls (Show on canvas + opacity), an Original/Sprite compare, and Re-process / Download actions. Future dock sections (layers, animation frames, AI variations, edit history) append as further tabs.

## Generate modal — `05-modal-generate`

Title "Generate a sprite". Tabs **✦ Prompt / ⬆ Upload image**. Prompt textarea + "more detail = closer result" hint. Asset type + Size selects. **Image quality** segmented Low / Medium / **High ★2** with "High costs 2 tokens; Low & Medium cost 1." Footer: "★ 3 tokens · this costs 1" + **Cancel** / accent **Generate sprite**.

## Resize & Process modal — `06-modal-resize`

Title "Resize & Process" / "Re-processing is deliberate — adjust, preview, then apply." **Dimensions** W×H inputs + preset chips (16/24/32/48/64/80/96/128). **Fit / crop mode** None / Trim edges / Fill. **Remove background** toggle + **Tolerance** slider (30%). Right column **Live preview** (sprite on checkerboard + size label) with "Output is snapped to the active palette and background removed." Footer: **Cancel** / accent **Apply changes**. (Explicit Apply, operates on the cached source — free, no token.)

## Export modal — `07-modal-export`

Title "Export sprite" / "Paste straight into MakeCode Arcade, or download an image." **Recommended** primary card (accent-soft bg + accent border): sprite preview + "Copy for MakeCode" / "Copies the sprite as a MakeCode `img` literal" + big accent **⧉ Copy for MakeCode** button. "How to paste into MakeCode Arcade" numbered 1-2-3 guide + a paste-demo GIF slot. "Download as image" **PNG / JPEG / WEBP**. Footer **Done**.

## Reconciliations (mockup vs. implementation plan)

These are the only places the mockup diverges from `ui-redesign-implementation-plan.md` / ADR-0006. **The mockup wins on visuals; the plan wins on architecture.**

1. **Token names.** The plan proposed `--surface-{base,raised,overlay,sunken,stage}`, `--text-{primary,secondary,muted,disabled,inverse}`, `--accent{,-hover,-subtle}`. The mockup ships a *different, complete* naming: `--surface / --surface-raised / --surface-sunken / --surface-hover / --canvas-stage`, `--text / --text-muted / --text-subtle / --text-on-accent`, `--accent / -hover / -press / -contrast / -soft / -soft-2 / -border / -ring`, plus `--success/-soft`, `--warning/-soft`, `--danger/-soft`, `--info`, `--checker-a/-b`, `--shadow-xs/sm/md/lg/accent`, `--radius-xs..xl/pill`, `--sp-1..24`, `--font-*`, `--fs-*`, `--ease/-out`. **Use the mockup's names** (they're the locked artifact) and map `tailwind.config.js` to them.
2. **oklch + Geist + Press Start 2P.** Phase 1 must load the Geist / Geist Mono / Press Start 2P webfonts (the mockup uses Google Fonts) and accept oklch values verbatim. (Bun's lightningcss bundler passes oklch through fine.)
3. **Export JS/Python.** The mockup's Export modal foregrounds Copy-for-MakeCode + PNG/JPEG/WEBP and does **not** surface the JavaScript/Python code exports. The current app has them and the plan keeps them as a *tertiary, collapsible* section. Decision: keep JS/Python as a low-emphasis collapsible block in ExportModal (don't drop working functionality), styled to not compete with the primary card.
4. **Token chip values are mock data.** "★ 3 tokens", "costs 1/2", "Watch ad to earn a token" are display-only placeholders (monetization is out of scope per ADR-0006). Wire the chip to a `TokenContext` stub; no real ledger.
