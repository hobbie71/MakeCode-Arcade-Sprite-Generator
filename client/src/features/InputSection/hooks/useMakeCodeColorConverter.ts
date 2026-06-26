// React imports
import { useMemo, useCallback } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Lib imports — OKLab perceptual nearest-colour matcher (the production matcher).
import {
  buildPaletteLab,
  rgbaToMakeCodeColor,
} from "../../../utils/colors/oklab";

// Util imports
import { getRgbaDataFromCanvas } from "../../../utils/getDataFromCanvas";

// Type imports
import { MakeCodeColor } from "../../../types/color";
import { drawSpriteDataOnCanvasTransparent } from "../../SpriteEditor/libs/drawPixelOnCanvas";
import { PIXEL_SIZE } from "../../SpriteEditor/constants/canvas";

export const useMakeCodeColorConverter = () => {
  const { palette } = usePaletteSelected();
  // Pre-convert the active palette to OKLab once; reused for every pixel match.
  const paletteLab = useMemo(() => buildPaletteLab(palette), [palette]);

  const getSpriteDataFromCanvas = useCallback(
    (canvas: HTMLCanvasElement): MakeCodeColor[][] => {
      const rgbaData = getRgbaDataFromCanvas(canvas);
      const spriteData: MakeCodeColor[][] = [];

      for (let y = 0; y < canvas.height; y++) {
        const row: MakeCodeColor[] = [];
        for (let x = 0; x < canvas.width; x++) {
          const { r, g, b, a } = rgbaData[y][x];
          row.push(rgbaToMakeCodeColor(r, g, b, a, paletteLab));
        }
        spriteData.push(row);
      }

      return spriteData;
    },
    [paletteLab]
  );

  const mapCanvasToMakeCodeColors = useCallback(
    (
      canvas: HTMLCanvasElement,
      pixelSize: number = PIXEL_SIZE
    ): HTMLCanvasElement => {
      const updatedCanvas = document.createElement("canvas");
      updatedCanvas.width = canvas.width;
      updatedCanvas.height = canvas.height;
      const ctx = updatedCanvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get CTX");

      const spriteData = getSpriteDataFromCanvas(canvas);

      drawSpriteDataOnCanvasTransparent(
        updatedCanvas,
        { x: 0, y: 0 },
        spriteData,
        palette,
        pixelSize
      );

      return updatedCanvas;
    },
    [getSpriteDataFromCanvas, palette]
  );

  return {
    getSpriteDataFromCanvas,
    mapCanvasToMakeCodeColors,
  };
};
