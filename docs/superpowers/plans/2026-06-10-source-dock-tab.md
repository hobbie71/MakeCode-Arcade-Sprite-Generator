# Source Tab in the Right Dock — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating source-image preview (which collides with the undo/redo controls) with a tabbed **Source** section in the editor's right dock, adding a ghost overlay for tracing, an Original/Sprite compare, and Re-process/Download actions.

**Architecture:** A new editor-local context (`SourceGhostContext`, mirroring `GridContext`) carries ghost-overlay state between the dock panel and the canvas stage. `SourceOverlay` joins the existing overlay stack in `Canvas.tsx` using the `PreviewCanvas` transform pattern. `SourcePanel` becomes the second `RightDock` section (the dock already supports tabbed sections). `ImportPreview` is deleted.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS 3, existing app components (`Button`, `Switch`, `.range-input`, `.transparent` checkerboard). Client workspace only — no `shared/` or server changes.

**Spec:** `docs/superpowers/specs/2026-06-10-source-dock-tab-design.md`. One naming refinement vs the spec's sketch: context fields are ghost-prefixed (`ghostVisible`/`ghostOpacity`) for call-site clarity.

**Testing note:** This repo has **no client test suite** (server-only `bun test`, per CLAUDE.md), so tasks verify with typecheck + lint + live browser checks instead of TDD. Typecheck = `bunx tsc -b` from `client/` (exactly what the build runs). Browser checks use the dev server on `http://localhost:3001`.

**Verified codebase facts this plan relies on:**
- `spriteData` is `MakeCodeColor[][]`, indexed `[y][x]` (`useSpriteEditorCanvas.ts` paint loop); `MakeCodeColor.TRANSPARENT === "."`.
- `getHexFromMakeCodeColor(color, palette)` takes the palette as second arg (`utils/colors/getColorFromMakeCodeColor.ts`).
- `usePaletteSelected()` returns the active `MakeCodePalette` object.
- `.transparent` (checkerboard) is defined in `client/src/base.css`; `.range-input` and `.btn-outline` in `tailwind.src.css`.
- Generated source files are named `generated-sprite.png`; uploads keep their name (`useImageFileHandler.ts:194`).
- `EditorSurface` already receives `onOpenGenerate` / `onOpenResize` and renders inside `SpriteEditorProvider`, so dock content can use editor-local contexts (PalettePanel already does).
- `importedImage` must NOT be removed — `useImageFileHandler.ts:114` uses it as the re-process fallback and `GenerationControls.tsx:121` gates a button on it. Only the `ImportPreview` component dies.

---

### Task 1: SourceGhostContext

**Files:**
- Create: `client/src/features/SpriteEditor/contexts/SourceGhostContext/SourceGhostContext.tsx`
- Create: `client/src/features/SpriteEditor/contexts/SourceGhostContext/useSourceGhost.ts`
- Modify: `client/src/features/SpriteEditor/provider/SpriteEditorProviders.tsx`

- [ ] **Step 1.1: Create the context + provider** (mirrors `GridContext/GridContext.tsx`)

`client/src/features/SpriteEditor/contexts/SourceGhostContext/SourceGhostContext.tsx`:

```tsx
import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type SourceGhostContextType = {
  /** Whether the source image is projected over the canvas. Default off. */
  ghostVisible: boolean;
  setGhostVisible: Dispatch<SetStateAction<boolean>>;
  /** Ghost opacity, 0–1. Default 0.5. */
  ghostOpacity: number;
  setGhostOpacity: Dispatch<SetStateAction<number>>;
};

const SourceGhostContext = createContext<undefined | SourceGhostContextType>(
  undefined
);

export const SourceGhostProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ghostVisible, setGhostVisible] = useState<boolean>(false);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0.5);

  const contextValue = useMemo(
    () => ({ ghostVisible, setGhostVisible, ghostOpacity, setGhostOpacity }),
    [ghostVisible, ghostOpacity]
  );

  return (
    <SourceGhostContext.Provider value={contextValue}>
      {children}
    </SourceGhostContext.Provider>
  );
};

export { SourceGhostContext };
```

- [ ] **Step 1.2: Create the hook** (mirrors `GridContext/useGrid.ts`)

`client/src/features/SpriteEditor/contexts/SourceGhostContext/useSourceGhost.ts`:

```ts
import { useContext } from "react";
import { SourceGhostContext } from "./SourceGhostContext";

export const useSourceGhost = () => {
  const context = useContext(SourceGhostContext);
  if (!context)
    throw new Error("useSourceGhost must be inside <SourceGhostProvider>");
  return context;
};
```

- [ ] **Step 1.3: Mount the provider**

In `client/src/features/SpriteEditor/provider/SpriteEditorProviders.tsx`, add the import:

```tsx
import { SourceGhostProvider } from "../contexts/SourceGhostContext/SourceGhostContext";
```

and wrap inside `GridProvider` (replace the `<ShapeModeProvider>…</ShapeModeProvider>` block nesting):

```tsx
<GridProvider>
  <SourceGhostProvider>
    <ShapeModeProvider>
      <FillOptionsProvider>
        <PixelPerfectProvider>{children}</PixelPerfectProvider>
      </FillOptionsProvider>
    </ShapeModeProvider>
  </SourceGhostProvider>
</GridProvider>
```

- [ ] **Step 1.4: Typecheck + lint**

```bash
cd client && bunx tsc -b && cd .. && bun run --filter client lint
```

Expected: both exit 0, no new warnings.

- [ ] **Step 1.5: Commit**

```bash
git add client/src/features/SpriteEditor/contexts/SourceGhostContext client/src/features/SpriteEditor/provider/SpriteEditorProviders.tsx
git commit -m "Editor: add SourceGhostContext for the source-image ghost overlay"
```

---

### Task 2: SourceOverlay on the canvas stage; delete ImportPreview

**Files:**
- Create: `client/src/features/SpriteEditor/components/SourceOverlay.tsx`
- Modify: `client/src/features/SpriteEditor/components/Canvas.tsx` (imports ~line 25, JSX ~lines 240–281)
- Delete: `client/src/features/SpriteEditor/components/ImportPreview.tsx`

- [ ] **Step 2.1: Create SourceOverlay**

`client/src/features/SpriteEditor/components/SourceOverlay.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";

import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useSourceGhost } from "../contexts/SourceGhostContext/useSourceGhost";

interface Props {
  width: number;
  height: number;
  pixelSize: number;
  offset: { x: number; y: number };
  zoom: number;
}

/**
 * Ghost of the source image for tracing: stretched to the sprite's pixel
 * bounds and tracking the same pan/zoom transform as the main canvas (the
 * PreviewCanvas pattern). Mounted right after the main canvas with no
 * z-index, so it stacks above the sprite pixels but below the stroke
 * preview (z-10) and grid (z-20). Never intercepts pointer events.
 */
const SourceOverlay = ({ width, height, pixelSize, offset, zoom }: Props) => {
  const { ghostVisible, ghostOpacity } = useSourceGhost();
  const { sourceImage } = useImageImports();
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);

  // Decode the source File once per change; close stale bitmaps.
  useEffect(() => {
    if (!sourceImage) {
      setBitmap((prev) => {
        prev?.close();
        return null;
      });
      return;
    }
    let cancelled = false;
    createImageBitmap(sourceImage).then((bmp) => {
      if (cancelled) {
        bmp.close();
        return;
      }
      setBitmap((prev) => {
        prev?.close();
        return bmp;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [sourceImage]);

  // Repaint when the bitmap or sprite bounds change. ghostVisible is a dep so
  // the repaint also runs right after the canvas remounts on toggle-on.
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !bitmap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }, [bitmap, width, height, pixelSize, ghostVisible]);

  if (!ghostVisible || !bitmap) return null;

  return (
    <canvas
      ref={overlayRef}
      width={width * pixelSize}
      height={height * pixelSize}
      className="absolute"
      aria-hidden="true"
      style={{
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: "50% 50%",
        opacity: ghostOpacity,
        pointerEvents: "none",
      }}
    />
  );
};

export default SourceOverlay;
```

- [ ] **Step 2.2: Swap it into Canvas.tsx**

In `client/src/features/SpriteEditor/components/Canvas.tsx`:

Replace the import (line 25):

```tsx
import ImportPreview from "./ImportPreview";
```

with:

```tsx
import SourceOverlay from "./SourceOverlay";
```

In the JSX, insert `SourceOverlay` immediately after the main `<canvas …/>` element (after line 259, before `<GridOverlay`):

```tsx
      <SourceOverlay
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
```

and delete the `<ImportPreview />` line (between `<PreviewCanvas …/>` and `<SelectionOverlay`).

- [ ] **Step 2.3: Delete the old component**

```bash
git rm client/src/features/SpriteEditor/components/ImportPreview.tsx
```

- [ ] **Step 2.4: Typecheck + lint**

```bash
cd client && bunx tsc -b && cd .. && bun run --filter client lint
```

Expected: exit 0. (`tsc` would fail here if any other file still imported `ImportPreview` — there are none.)

- [ ] **Step 2.5: Commit**

```bash
git add client/src/features/SpriteEditor/components/SourceOverlay.tsx client/src/features/SpriteEditor/components/Canvas.tsx
git commit -m "Editor: replace floating ImportPreview with SourceOverlay ghost"
```

---

### Task 3: SpriteThumbnail + SourcePanel

**Files:**
- Create: `client/src/features/SpriteEditor/layout/SpriteThumbnail.tsx`
- Create: `client/src/features/SpriteEditor/layout/SourcePanel.tsx`

- [ ] **Step 3.1: Create SpriteThumbnail**

`client/src/features/SpriteEditor/layout/SpriteThumbnail.tsx`:

```tsx
import { useEffect, useRef } from "react";

import { useSprite } from "../../../context/SpriteContext/useSprite";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { MakeCodeColor } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

/**
 * Live thumbnail of the committed sprite: one canvas pixel per sprite pixel,
 * upscaled crisply by CSS. Repaints on committed edits, undo/redo, and
 * palette swaps — the same triggers as the main canvas repaint.
 */
export default function SpriteThumbnail() {
  const { spriteData } = useSprite();
  const { palette } = usePaletteSelected();
  const ref = useRef<HTMLCanvasElement>(null);

  const rows = spriteData.length;
  const cols = spriteData[0]?.length ?? 0;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const color = spriteData[y]?.[x] ?? MakeCodeColor.TRANSPARENT;
        if (color === MakeCodeColor.TRANSPARENT) continue;
        ctx.fillStyle = getHexFromMakeCodeColor(color, palette);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [spriteData, palette, rows, cols]);

  return (
    <canvas
      ref={ref}
      width={cols || 1}
      height={rows || 1}
      className="max-h-full max-w-full object-contain"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
```

- [ ] **Step 3.2: Create SourcePanel**

`client/src/features/SpriteEditor/layout/SourcePanel.tsx`:

```tsx
import { useEffect, useState } from "react";

import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import SpriteThumbnail from "./SpriteThumbnail";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useSourceGhost } from "../contexts/SourceGhostContext/useSourceGhost";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
}

/**
 * Right-dock Source section: the cached source image (what Generate produced
 * and Resize & Process re-consumes), ghost-overlay controls, an
 * Original-vs-Sprite compare, and contextual actions. Shows a generate CTA
 * when no source exists (blank canvas / pasted sprite). There is deliberately
 * no "clear" action: dropping the source would disable free re-processing.
 */
export default function SourcePanel({ onOpenGenerate, onOpenResize }: Props) {
  const { sourceImage } = useImageImports();
  const { ghostVisible, setGhostVisible, ghostOpacity, setGhostOpacity } =
    useSourceGhost();
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // One object URL per source file, revoked on change/unmount.
  useEffect(() => {
    if (!sourceImage) {
      setSourceUrl(null);
      return;
    }
    const url = URL.createObjectURL(sourceImage);
    setSourceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sourceImage]);

  if (!sourceImage || !sourceUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-surface p-4 text-center">
        <p className="text-xs leading-relaxed text-ink-subtle">
          No source image yet. Generate or upload one and it will appear here
          for tracing, comparing and re-processing.
        </p>
        <Button variant="primary" onClick={onOpenGenerate}>
          ✦ Generate
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Source image viewer */}
      <div className="transparent flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-line">
        <img
          src={sourceUrl}
          alt="Source image"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Ghost overlay controls */}
      <div className="rounded-md border border-line p-2">
        <Switch
          label="Show on canvas"
          title="Project the source image over the canvas for tracing"
          checked={ghostVisible}
          onChange={setGhostVisible}
          className="w-full justify-between"
        />
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Opacity</span>
            <span>{Math.round(ghostOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(ghostOpacity * 100)}
            onChange={(e) => setGhostOpacity(Number(e.target.value) / 100)}
            disabled={!ghostVisible}
            className="range-input"
            aria-label="Ghost opacity"
          />
        </div>
      </div>

      {/* Original vs sprite compare */}
      <div className="grid grid-cols-2 gap-2">
        <figure className="min-w-0">
          <div className="transparent flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line">
            <img
              src={sourceUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <figcaption className="mt-1 text-center text-xs text-ink-muted">
            Original
          </figcaption>
        </figure>
        <figure className="min-w-0">
          <div className="transparent flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line p-1">
            <SpriteThumbnail />
          </div>
          <figcaption className="mt-1 text-center text-xs text-ink-muted">
            Sprite
          </figcaption>
        </figure>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onOpenResize} className="flex-1">
          ⟲ Re-process
        </Button>
        <a
          href={sourceUrl}
          download={sourceImage.name}
          className="btn-outline flex-1 text-center">
          ⬇ Download
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3.3: Typecheck + lint**

```bash
cd client && bunx tsc -b && cd .. && bun run --filter client lint
```

Expected: exit 0. (The new files aren't imported anywhere yet — that's Task 4.)

- [ ] **Step 3.4: Commit**

```bash
git add client/src/features/SpriteEditor/layout/SpriteThumbnail.tsx client/src/features/SpriteEditor/layout/SourcePanel.tsx
git commit -m "Editor: add SourcePanel + SpriteThumbnail for the right dock"
```

---

### Task 4: Wire the Source tab; remove the Coming-soon card

**Files:**
- Modify: `client/src/features/SpriteEditor/EditorSurface.tsx:35-44`
- Modify: `client/src/features/SpriteEditor/layout/PalettePanel.tsx:53-62`

- [ ] **Step 4.1: Register the dock section**

In `client/src/features/SpriteEditor/EditorSurface.tsx`, add the import:

```tsx
import SourcePanel from "./layout/SourcePanel";
```

and extend the `RightDock` call (Palette stays first = default tab; no auto-switching):

```tsx
        <RightDock
          sections={[
            {
              id: "palette",
              label: "Palette",
              content: <PalettePanel />,
              defaultOpen: true,
            },
            {
              id: "source",
              label: "Source",
              content: (
                <SourcePanel
                  onOpenGenerate={onOpenGenerate}
                  onOpenResize={onOpenResize}
                />
              ),
            },
          ]}
        />
```

- [ ] **Step 4.2: Remove the Coming-soon placeholder**

In `client/src/features/SpriteEditor/layout/PalettePanel.tsx`, delete this block (lines 53–62) — the dock now grows via real tabs:

```tsx
      {/* Future dock sections (placeholder, mirrors the mockup) */}
      <div className="rounded-md border border-line bg-surface p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <span aria-hidden>⚙</span> Coming soon
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
          This dock will also host layers, animation frames, AI variations and
          edit history.
        </p>
      </div>
```

Also update the file's doc comment (lines 8–12) to:

```tsx
/**
 * Right-dock palette section (mockup 04-studio): palette picker, the Arcade
 * swatch grid, and the selected-color readout.
 */
```

- [ ] **Step 4.3: Typecheck + lint**

```bash
cd client && bunx tsc -b && cd .. && bun run --filter client lint
```

Expected: exit 0.

- [ ] **Step 4.4: Smoke-check in the browser**

With the dev server on `http://localhost:3001`: open the studio, confirm the dock shows **Palette | Source** tabs, the Source tab shows the empty state (blank canvas), and no floating preview appears in the canvas's top-right corner.

- [ ] **Step 4.5: Commit**

```bash
git add client/src/features/SpriteEditor/EditorSurface.tsx client/src/features/SpriteEditor/layout/PalettePanel.tsx
git commit -m "Editor: wire Source tab into the right dock"
```

---

### Task 5: Docs + full verification

**Files:**
- Modify: `docs/design/visual-spec.md:32`

- [ ] **Step 5.1: Update the visual spec's dock description**

Replace line 32 of `docs/design/visual-spec.md`:

```md
- **Right dock (collapsible):** tabbed; first tab **Palette** with an "Arcade" palette dropdown, the 16-swatch Arcade grid, selected-swatch readout ("Blue · index 8 · #003FAD"), and a "Coming soon — layers, animation frames, AI variations, edit history" placeholder (future dock sections).
```

with:

```md
- **Right dock (collapsible):** tabbed; first tab **Palette** with an "Arcade" palette dropdown, the 16-swatch Arcade grid, and the selected-swatch readout ("Blue · index 8 · #003FAD"); second tab **Source** with the cached source image on a checkerboard, ghost-overlay controls (Show on canvas + opacity), an Original/Sprite compare, and Re-process / Download actions. Future dock sections (layers, animation frames, AI variations, edit history) append as further tabs.
```

- [ ] **Step 5.2: Full client build**

```bash
bun run --filter client build
```

Expected: css:build, `tsc -b`, bundle, and public copy all succeed.

- [ ] **Step 5.3: Full browser verification** (dev server, `http://localhost:3001`)

1. **Upload path:** Studio → Generate modal → Upload image → pick any PNG. Source tab shows the image; canvas gets the processed sprite; no floating preview over the canvas corner; undo/redo controls unobstructed.
2. **Ghost:** Toggle "Show on canvas" — image appears over the sprite at 50%; slider changes opacity; ghost tracks pan (two-finger scroll) and zoom (pinch / zoom menu); drawing still works through it (it must not eat pointer events).
3. **Compare:** Draw a few pixels — the Sprite thumbnail updates after each stroke commit; undo updates it too.
4. **Actions:** Re-process opens the Resize & Process modal; Download saves the file (named `generated-sprite.png` or the upload's name).
5. **Persistence:** With ghost ON, upload a different image — ghost stays on and shows the new image.
6. **Empty state:** Generate modal → blank canvas path (Draw Blank) — Source tab shows the hint + ✦ Generate button, which opens the Generate modal.
7. **Resize:** Re-process to a different size — ghost re-stretches to the new bounds.
8. **Mobile (DevTools device mode):** below `lg`, the floating right-edge tab opens the bottom sheet; both tabs present and functional.

- [ ] **Step 5.4: Commit**

```bash
git add docs/design/visual-spec.md
git commit -m "Docs: right dock visual spec covers the Source tab"
```
