# Source tab in the right dock

**Date:** 2026-06-10 · **Branch:** `ui-redesign` · **Scope:** client only (no `shared/` or server changes)

## Problem

The generated/uploaded image preview (`ImportPreview`) floats over the canvas's top-right corner, where it now collides with the undo/redo history controls. It also caps the preview at 128px, shows it permanently, and offers no interaction.

## Decision summary

Remove the floating preview entirely. Add a second tab — **Source** — to the existing right dock (`RightDock` already supports tabbed sections by design), showing the cached **source image** (canonical term per ADR-0006 and `CONTEXT.md`; the artifact `ImageImportContext.sourceImage` already holds). The tab adds three features: a ghost overlay for tracing, a side-by-side compare, and an actions row.

Decisions resolved during design review:

| Decision | Outcome |
|---|---|
| Naming | One term: **Source** (tab label, `SourcePanel`, `SourceOverlay`, `SourceGhostContext`). "Reference" is avoided — see CONTEXT.md. |
| Old overlay | `ImportPreview` deleted outright. `importedImage` context state stays — it still feeds re-processing (`useImageFileHandler.ts` fallback) and gates a GenerationControls button. |
| Clear button | **Dropped.** Clearing `sourceImage` would disable Resize & Process (gated on `sourceImage != null`), forcing a paid re-generation — contradicts ADR-0006's free re-processing model. |
| Ghost z-order | Above the sprite pixels, below grid/selection overlays. (Below-sprite was rejected: Generate auto-processes, so the canvas starts fully painted and an under-ghost would be invisible.) |
| Ghost persistence | Toggle is a workspace preference: stays on across new generations/uploads, swapping to the new source. Default off, opacity default 50%. |
| Dock behavior | Palette remains the first/default tab. No auto-switching on generation. |
| Re-process button | Kept in the tab (third entry point to the existing Resize & Process modal — contextual to the artifact it operates on). |
| "Coming soon" card | Removed from `PalettePanel` (the dock now grows via real tabs). |

## Components

### 1. `SourcePanel` — `features/SpriteEditor/layout/SourcePanel.tsx`

Dock section content, top to bottom:

- **Image viewer** — the source image (`<img>` from a memoized object URL) on a transparency checkerboard, rounded border per dock styling.
- **Ghost controls** — "Show on canvas" toggle + opacity slider (disabled until toggled on). Reads/writes `SourceGhostContext`.
- **Compare** — two labeled thumbnails side by side: **Original** (same object URL) and **Sprite** (live thumbnail drawn from `spriteData` + selected palette; re-renders on committed edits, undo/redo, palette swap).
- **Actions row** — **Re-process** (calls the `onOpenResize` handler that opens the existing Resize & Process modal) and **Download** (anchor download of the source file, named from `sourceImage.name` — generated images are already `File("generated-sprite.png")`).
- **Empty state** (when `sourceImage == null`, e.g. blank canvas or pasted sprite): short hint + "Generate with AI" button via `onOpenGenerate`.

Props: `{ onOpenGenerate, onOpenResize }` passed from `EditorSurface` (which already receives them).

### 2. `SourceGhostContext` — `features/SpriteEditor/contexts/SourceGhostContext/`

`{ visible: boolean; opacity: number; setVisible; setOpacity }` — defaults `visible: false`, `opacity: 0.5`. Follows the existing `GridContext` pattern (context + hook + provider mounted with the other editor-local contexts). Needed because controls live in the dock while rendering happens on the canvas stage.

### 3. `SourceOverlay` — `features/SpriteEditor/components/SourceOverlay.tsx`

A canvas in `Canvas.tsx`'s existing overlay stack, taking the same `width/height/pixelSize/offset/zoom` props as `GridOverlay` so it tracks pan/zoom identically. Draws the source image stretched to the sprite's pixel bounds (`width*pixelSize × height*pixelSize`); aspect mismatch resolves by stretching (predictable for tracing). CSS `opacity` from context, `pointer-events: none`. Mounted after the main sprite canvas and before `GridOverlay`. Renders nothing when `!visible || !sourceImage`.

### 4. Wiring — `EditorSurface.tsx`

Append `{ id: "source", label: "Source", content: <SourcePanel … /> }` to the `RightDock` sections array. The mobile bottom-sheet inherits the tab automatically.

### Deletions / doc updates

- Delete `components/ImportPreview.tsx` and its mount in `Canvas.tsx`.
- Remove the "Coming soon" card from `PalettePanel.tsx`.
- Update `docs/design/visual-spec.md`'s right-dock description (currently "first tab Palette … placeholder").

## Data flow

`ImageImportContext.sourceImage` (File) → object URL (created/revoked in an effect) → panel `<img>`, compare Original thumb, and `SourceOverlay` bitmap. Ghost state flows `SourcePanel` ↔ `SourceGhostContext` → `SourceOverlay`.

## Edge cases

- No source image: panel shows empty state; overlay renders nothing; ghost toggle state is irrelevant until a source exists.
- Blank-canvas flow already nulls `sourceImage` (`GenerationControls`), which empties the panel and hides the ghost.
- Canvas resize (e.g. 16×16 → 32×32): overlay bounds are prop-driven, so the ghost re-stretches automatically.
- Object URLs revoked on source change and unmount.
- Ghost registration: the ghost stretches the source to the sprite's bounds, while Process may crop/letterbox — so the ghost guides free-form tracing but is not pixel-registered with the processed placement when cropping ran or aspect ratios differ.

## Verification

No client test suite exists. Verify via `bun run --filter client lint`, `tsc` (via the client build), and live browser checks in the pinned dev-chrome tab (port 3001): generate → Source tab populates; ghost tracks pan/zoom and opacity; compare updates after edits; Re-process opens the modal; Download saves the PNG; empty state on blank canvas; mobile bottom-sheet via device mode.
