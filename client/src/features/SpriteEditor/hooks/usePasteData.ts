import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSprite } from "../../../context/SpriteContext/useSprite";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

import { useMakeCodeColorConverter } from "../../InputSection/hooks/useMakeCodeColorConverter";

// Type imports
import { MakeCodeColor } from "../../../types/color";

export const usePasteData = () => {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { setSpriteData } = useSprite();
  const { getSpriteDataFromCanvas } = useMakeCodeColorConverter();

  const pasteSpriteData = useCallback(
    (spriteData: MakeCodeColor[][]) => {
      if (!canvasRef.current) return;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          drawPixelOnCanvas(
            canvasRef.current,
            { x, y },
            spriteData[y][x],
            palette
          );
        }
      }

      setSpriteData(spriteData);
    },
    [canvasRef, height, width, setSpriteData, palette]
  );

  const pasteCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const spriteData = getSpriteDataFromCanvas(canvas);
      pasteSpriteData(spriteData);
    },
    [getSpriteDataFromCanvas, pasteSpriteData]
  );

  return { pasteSpriteData, pasteCanvas };
};
