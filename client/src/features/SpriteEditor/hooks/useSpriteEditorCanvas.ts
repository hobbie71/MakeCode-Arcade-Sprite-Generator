import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import { MakeCodeColor } from "@/types/color";

export const useSpriteEditorCanvas = (width: number, height: number) => {
  // Hooks
  const { canvasRef } = useCanvas();
  const { initCanvasOnly } = useSpriteData();
  const { palette } = usePaletteSelected();

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const currentData = initCanvasOnly();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = currentData[y]
          ? currentData[y][x]
          : MakeCodeColor.TRANSPARENT;
        drawPixelOnCanvas(canvasRef.current, { x, y }, color, palette);
      }
    }
  }, [canvasRef, height, width, initCanvasOnly, palette]);

  return {
    initCanvas,
  };
};
