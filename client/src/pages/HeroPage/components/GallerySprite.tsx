import { useEffect, useMemo, useRef } from "react";

import { ArcadePalette } from "../../../types/color";
import { drawSpriteDataOnCanvasTransparent } from "../../../features/SpriteEditor/libs/drawPixelOnCanvas";
import {
  isValidMakeCodeSprite,
  parseMakeCodeSprite,
} from "../../../utils/makeCodeSpriteValidation";

/**
 * Renders a single gallery sprite (an Example) from its MakeCode `img` literal.
 *
 * The literal is parsed to a palette-index grid and painted to a <canvas> at
 * 1:1 (one device pixel per sprite pixel) on the fixed Arcade palette; CSS then
 * upscales it with `image-rendering: pixelated`, so it stays crisp at any cell
 * size and any sprite dimension (16×16 → 160×120). Transparent pixels are left
 * unpainted so the tile background shows through.
 *
 * An empty or malformed literal renders a neutral placeholder, so the gallery
 * looks intentional while literals are pasted in one at a time.
 */
export default function GallerySprite({
  literal,
  label,
  size,
}: {
  literal: string;
  label: string;
  size: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grid = useMemo(
    () => (isValidMakeCodeSprite(literal) ? parseMakeCodeSprite(literal) : null),
    [literal]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    // Setting width/height resets the canvas; transparent pixels stay unpainted.
    canvas.width = grid[0].length;
    canvas.height = grid.length;

    drawSpriteDataOnCanvasTransparent(
      canvas,
      { x: 0, y: 0 },
      grid,
      ArcadePalette,
      1 // 1:1 — CSS handles the upscale via image-rendering: pixelated
    );
  }, [grid]);

  if (!grid) {
    return (
      <span className="font-mono text-2xs text-ink-subtle" aria-hidden="true">
        {size}
      </span>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="h-full w-full object-contain [image-rendering:pixelated]"
    />
  );
}
