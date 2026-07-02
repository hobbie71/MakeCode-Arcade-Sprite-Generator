import { useCallback, useEffect, useRef, useState } from "react";

import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useImageFileHandler } from "../../InputSection/hooks/useImageFileHandler";

interface Props {
  sourceUrl: string;
}

/**
 * Drag-to-compare viewer: the source image and the live sprite share one box
 * (the sprite's aspect), split by a draggable divider: original to the left,
 * sprite to the right.
 *
 * The sprite side is copied 1:1 from the editor's canvas element after each
 * committed repaint, so it always shows exactly what the editor shows. The
 * original side is re-processed through the sprite's exact geometry
 * (background removal → crop → scale) minus the palette snap, so a cropped or
 * filled sprite lines up with its source instead of drifting as the divider
 * is dragged.
 */
export default function SourceCompare({ sourceUrl }: Props) {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { spriteData } = useSprite();
  const { palette } = usePaletteSelected();
  const { sourceImage } = useImageImports();
  const { settings } = usePostProcessing();
  const { crop, removeBackground, tolerance } = settings;
  const { processSourceToCanvas } = useImageFileHandler();
  const boxRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);
  const frameToken = useRef(0);
  const [pos, setPos] = useState(50);
  // The source, re-framed with the sprite's geometry (see below). Falls back to
  // the raw source URL until it's ready / if re-framing fails.
  const [framedUrl, setFramedUrl] = useState<string | null>(null);

  // Re-frame the source the same way the sprite was produced — background
  // removal, then the current crop mode, then scale to the sprite size — but
  // WITHOUT the palette snap, so the original colours show under the sprite's
  // exact framing. Without this the raw source is stretched edge-to-edge and a
  // cropped/filled sprite drifts badly against it as the divider moves. Runs
  // only when the source, size or crop/background settings change; a token
  // guards against a slow run overwriting a newer one.
  useEffect(() => {
    if (!sourceImage) {
      setFramedUrl(null);
      return;
    }
    // A monotonic token guards against a slow run overwriting a newer one; a
    // late resolve after unmount is a harmless no-op setState.
    const token = ++frameToken.current;
    const fresh = () => token === frameToken.current;
    processSourceToCanvas(
      sourceImage,
      width,
      height,
      { crop, removeBackground, tolerance },
      { skipColorSnap: true }
    )
      .then((canvas) => {
        if (fresh()) setFramedUrl(canvas.toDataURL("image/png"));
      })
      // Fall back to the raw source URL (rendered below) on any failure.
      .catch(() => {
        if (fresh()) setFramedUrl(null);
      });
  }, [
    sourceImage,
    width,
    height,
    crop,
    removeBackground,
    tolerance,
    processSourceToCanvas,
  ]);

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
        {/* Original, re-framed to the sprite's exact geometry so it lines up
            with the sprite side; clipped to the left of the divider. */}
        <img
          src={framedUrl ?? sourceUrl}
          alt="Source image"
          draggable={false}
          className="absolute inset-0 h-full w-full"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            imageRendering: "pixelated",
          }}
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
