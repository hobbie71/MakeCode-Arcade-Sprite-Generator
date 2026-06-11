import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSprite } from "../../../context/SpriteContext/useSprite";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import { MakeCodeColor } from "../../../types/color";

export const useSpriteEditorCanvas = (width: number, height: number) => {
  // Hooks
  const { canvasRef } = useCanvas();
  const { initCanvasOnly } = useSpriteData();
  const { spriteData } = useSprite();
  const { palette } = usePaletteSelected();

  // Paint every pixel of the sprite data. (Grid lines are drawn separately by
  // GridOverlay, so they no longer get baked into the zoom-scaled bitmap.)
  const paint = useCallback(
    (data: MakeCodeColor[][]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Tolerate data smaller than the canvas (e.g. a single frame mid-resize
          // where size and sprite data haven't converged yet): missing cells read
          // as transparent rather than painting a stale color.
          const color = data[y]?.[x] ?? MakeCodeColor.TRANSPARENT;
          drawPixelOnCanvas(canvas, { x, y }, color, palette);
        }
      }
    },
    [canvasRef, height, width, palette]
  );

  // Initial paint: seeds/normalizes sprite data via the ref, then renders it.
  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const currentData = initCanvasOnly();
    paint(currentData);
  }, [canvasRef, initCanvasOnly, paint]);

  // Full repaint from the committed sprite-data state. Used when something other
  // than an in-progress draw changes the canvas (undo/redo, grid toggle).
  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    paint(spriteData);
  }, [canvasRef, paint, spriteData]);

  return {
    initCanvas,
    redrawCanvas,
  };
};
