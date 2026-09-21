import { useEffect, useMemo, useRef } from "react";

import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { containFrame } from "../../InputSection/utils/sourceFrame";
import { drawSourceFrame } from "../libs/drawSourceFrame";
import { useSourceBitmap } from "./useSourceBitmap";

const NO_BACKING = { backingWidth: 1, backingHeight: 1 };

/**
 * A canvas ref plus backing size for drawing the full-res source cropped to
 * the sprite's frame (the stored `sourceFrame`, or the no-crop contain frame
 * before the first process). The frame's aspect equals the sprite's, so the
 * backing store is the frame scaled down to `maxEdge` on its long side.
 * Repaints when the source, frame, or size changes, and whenever `redrawKey`
 * changes (for callers whose canvas remounts).
 */
export function useFramedSourceCanvas(
  width: number,
  height: number,
  maxEdge: number,
  redrawKey?: unknown
) {
  const { sourceFrame } = useImageImports();
  const bitmap = useSourceBitmap();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const framed = useMemo(() => {
    if (!bitmap) return null;
    const frame =
      sourceFrame ?? containFrame(bitmap.width, bitmap.height, width, height);
    const scale = Math.min(1, maxEdge / Math.max(frame.width, frame.height));
    return {
      bitmap,
      frame,
      backingWidth: Math.max(1, Math.round(frame.width * scale)),
      backingHeight: Math.max(1, Math.round(frame.height * scale)),
    };
  }, [bitmap, sourceFrame, width, height, maxEdge]);
  const { backingWidth, backingHeight } = framed ?? NO_BACKING;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !framed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSourceFrame(ctx, framed.bitmap, framed.frame, canvas.width, canvas.height);
  }, [framed, redrawKey]);

  return { canvasRef, bitmap, backingWidth, backingHeight };
}
