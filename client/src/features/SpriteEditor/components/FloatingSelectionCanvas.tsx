import { useEffect, useRef } from "react";

import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import { drawSpriteDataOnCanvasTransparent } from "../libs/drawPixelOnCanvas";

interface Props {
  width: number;
  height: number;
  pixelSize: number;
  offset: { x: number; y: number };
  zoom: number;
}

/**
 * Renders the floating selection's pixels above the committed sprite. A
 * doc-sized canvas with the exact transform of PreviewCanvas, so zoom/pan sync
 * is free; the main canvas keeps showing the lift-hole underneath. Transparent
 * float cells are skipped (transparent apply preview), and off-canvas portions
 * clip at the sprite border — the ants overlay still outlines them, which
 * reads as "this will be cropped on commit".
 */
const FloatingSelectionCanvas = ({
  width,
  height,
  pixelSize,
  offset,
  zoom,
}: Props) => {
  const { floating, floatingPixels } = useSelection();
  const { palette } = usePaletteSelected();
  const floatRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = floatRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!floating || !floatingPixels) return;
    drawSpriteDataOnCanvasTransparent(
      canvas,
      { x: floating.rect.x, y: floating.rect.y },
      floatingPixels.data,
      palette,
      pixelSize
    );
  }, [floating, floatingPixels, palette, pixelSize, width, height]);

  return (
    <canvas
      ref={floatRef}
      width={width * pixelSize}
      height={height * pixelSize}
      className="absolute z-10"
      style={{
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: "50% 50%",
        pointerEvents: "none",
      }}
    />
  );
};

export default FloatingSelectionCanvas;
