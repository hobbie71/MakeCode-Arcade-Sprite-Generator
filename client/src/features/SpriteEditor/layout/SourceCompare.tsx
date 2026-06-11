import { useCallback, useEffect, useRef, useState } from "react";

import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

interface Props {
  sourceUrl: string;
}

/**
 * Drag-to-compare viewer: the source image and the live sprite share one box
 * (the sprite's aspect — the same mapping the ghost uses on the canvas),
 * split by a draggable divider: original to the left, sprite to the right.
 * The sprite side is copied 1:1 from the editor's canvas element after each
 * committed repaint, so it always shows exactly what the editor shows.
 */
export default function SourceCompare({ sourceUrl }: Props) {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { spriteData } = useSprite();
  const { palette } = usePaletteSelected();
  const boxRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);

  // Copy the editor canvas one frame after it repaints. Canvas.tsx redraws in
  // a passive effect on the same triggers (committed edits, undo/redo, palette
  // swap, resize); rAF fires after that frame paints, so the copy is fresh.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const dest = copyRef.current;
      const src = canvasRef.current;
      if (!dest || !src || src.width === 0) return;
      if (dest.width !== src.width) dest.width = src.width;
      if (dest.height !== src.height) dest.height = src.height;
      const ctx = dest.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, dest.width, dest.height);
      ctx.drawImage(src, 0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [canvasRef, spriteData, palette, width, height]);

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div className="transparent flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-line">
      {/* Sprite-aspect content box, letterboxed inside the square viewer. */}
      <div
        ref={boxRef}
        className="relative max-h-full max-w-full touch-none select-none"
        style={{
          aspectRatio: `${width} / ${height}`,
          ...(width >= height ? { width: "100%" } : { height: "100%" }),
        }}
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromPointer(e.clientX);
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}>
        {/* Sprite: 1:1 copy of the editor canvas. */}
        <canvas
          ref={copyRef}
          className="h-full w-full"
          style={{ imageRendering: "pixelated" }}
          aria-hidden="true"
        />
        {/* Original, stretched to the sprite's box (the ghost's mapping),
            clipped to the left of the divider. */}
        <img
          src={sourceUrl}
          alt="Source image"
          draggable={false}
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        {/* Divider */}
        <div
          role="slider"
          aria-label="Compare original and sprite"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 cursor-ew-resize bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring"
          style={{ left: `${pos}%` }}>
          <span
            className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface-raised shadow-md"
            aria-hidden
          />
        </div>
        {/* Corner labels */}
        <span className="pointer-events-none absolute left-1 top-1 rounded bg-surface-raised px-1 text-[10px] font-medium text-ink-muted">
          Original
        </span>
        <span className="pointer-events-none absolute right-1 top-1 rounded bg-surface-raised px-1 text-[10px] font-medium text-ink-muted">
          Sprite
        </span>
      </div>
    </div>
  );
}
