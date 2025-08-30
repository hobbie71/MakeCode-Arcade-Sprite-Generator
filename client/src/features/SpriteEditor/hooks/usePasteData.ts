import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSprite } from "../../../context/SpriteContext/useSprite";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import { MakeCodeColor } from "../../../types";

export const usePasteData = () => {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { setSpriteData } = useSprite();

  const pasteSpriteData = useCallback(
    (pastedData: MakeCodeColor[][]) => {
      if (!canvasRef.current) return;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          drawPixelOnCanvas(
            canvasRef.current,
            { x, y },
            pastedData[y][x],
            palette
          );
        }
      }

      setSpriteData(pastedData);
    },
    [canvasRef, height, width, setSpriteData, palette]
  );

  return { pasteSpriteData };
};
