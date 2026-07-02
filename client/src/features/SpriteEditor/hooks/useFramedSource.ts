import { useEffect, useRef, useState } from "react";

import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useImageFileHandler } from "../../InputSection/hooks/useImageFileHandler";

/**
 * The cached source re-processed through the sprite's exact geometry —
 * background removal → the active crop → scale — but WITHOUT the palette snap,
 * returned as a PNG data URL. This is what lets the Source compare's "Original"
 * side line up pixel-for-pixel with the palette-snapped sprite instead of
 * drifting once a crop or background removal is applied.
 *
 * Returns `null` until the first result is ready (or if re-framing fails — the
 * caller falls back to the raw source). Recomputes only when the source, the
 * target size, or the crop / background settings change; a monotonic run id
 * discards a slow run superseded by a newer one.
 */
export function useFramedSource(width: number, height: number): string | null {
  const { sourceImage } = useImageImports();
  const { settings } = usePostProcessing();
  const { crop, removeBackground, tolerance } = settings;
  const { processSourceToCanvas } = useImageFileHandler();
  const runId = useRef(0);
  const [framedUrl, setFramedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceImage) {
      setFramedUrl(null);
      return;
    }
    const id = ++runId.current;
    const fresh = () => id === runId.current;
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

  return framedUrl;
}
