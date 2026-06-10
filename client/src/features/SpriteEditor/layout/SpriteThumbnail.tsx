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
