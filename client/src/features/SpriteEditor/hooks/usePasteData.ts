import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSprite } from "../../../context/SpriteContext/useSprite";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

import { useColorToMakeCodeConverter } from "../../InputSection/hooks/useColorToMakeCodeConverter";

// Type imports
import { MakeCodeColor } from "../../../types/color";
// Util imports
import { getImageDataFromCanvas } from "../../../utils/getDataFromCanvas";

export const usePasteData = () => {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { setSpriteData } = useSprite();
  const { convertImageToSpriteData } = useColorToMakeCodeConverter();

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

  const pasteCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const imageData = getImageDataFromCanvas(canvas);
      const spriteData = convertImageToSpriteData(
        imageData,
        canvas.width,
        canvas.height
      );
      pasteSpriteData(spriteData);
    },
    [convertImageToSpriteData, pasteSpriteData]
  );

  return { pasteSpriteData, pasteCanvas };
};
