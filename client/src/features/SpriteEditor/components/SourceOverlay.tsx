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
