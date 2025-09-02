// React imports
import { useMemo, useCallback } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Lib imports
import {
  hslToMakeCodeColor,
  rgbToMakeCodeColor,
  hexToMakeCodeColor,
  rgbaToMakeCodeColor,
} from "../libs/colorConverters";
import { convertImageDataToRGBA } from "../utils/convertImageDataToRGBA";

// Util imports
import { calculateHueZones } from "../utils/hueZoneUtils";

// Type imports
import { MakeCodeColor } from "../../../types/color";
import { drawSpriteDataOnCanvas } from "../../SpriteEditor/libs/drawPixelOnCanvas";
import { getImageDataFromCanvas } from "../../../utils/getDataFromCanvas";

export const useColorToMakeCodeConverter = () => {
  const { palette } = usePaletteSelected();
  const hueZones = useMemo(() => calculateHueZones(palette), [palette]);

  // Memoized conversion functions
  const converHslToMakeCodeColor = useCallback(
    (h: number, l: number): MakeCodeColor => {
      return hslToMakeCodeColor(h, l, hueZones);
    },
    [hueZones]
  );

  const convertRgbToMakeCodeColor = useCallback(
    (r: number, g: number, b: number): MakeCodeColor => {
      return rgbToMakeCodeColor(r, g, b, hueZones);
    },
    [hueZones]
  );

  const convertHexToMakeCodeColor = useCallback(
    (hex: string): MakeCodeColor => {
      return hexToMakeCodeColor(hex, hueZones);
    },
    [hueZones]
  );

  const convertRgbaToMakeCodeColor = useCallback(
    (
      r: number,
      g: number,
      b: number,
      a: number,
      alphaThreshold?: number
    ): MakeCodeColor => {
      return rgbaToMakeCodeColor(r, g, b, a, hueZones, alphaThreshold);
    },
    [hueZones]
  );

  const convertImageToSpriteData = useCallback(
    (
      imageData: ImageData,
      width: number,
      height: number
    ): MakeCodeColor[][] => {
      const rgbaData = convertImageDataToRGBA(imageData, width, height);
      const spriteData: MakeCodeColor[][] = [];

      for (let y = 0; y < height; y++) {
        const row: MakeCodeColor[] = [];
        for (let x = 0; x < width; x++) {
          const { r, g, b, a } = rgbaData[y][x];
          row.push(rgbaToMakeCodeColor(r, g, b, a, hueZones));
        }
        spriteData.push(row);
      }

      return spriteData;
    },
    [hueZones]
  );

  const getCanvasToMakeCodeColor = useCallback(
    (canvas: HTMLCanvasElement): HTMLCanvasElement => {
      const updatedCanvas = document.createElement("canvas");
      const ctx = updatedCanvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get CTX");

      const imageData = getImageDataFromCanvas(canvas);

      const spriteData = convertImageToSpriteData(
        imageData,
        canvas.width,
        canvas.height
      );

      drawSpriteDataOnCanvas(
        updatedCanvas,
        { x: 0, y: 0 },
        spriteData,
        palette
      );

      return updatedCanvas;
    },
    [convertImageToSpriteData, palette]
  );

  return {
    hueZones,
    converHslToMakeCodeColor,
    convertRgbToMakeCodeColor,
    convertHexToMakeCodeColor,
    convertRgbaToMakeCodeColor,
    convertImageToSpriteData,
    getCanvasToMakeCodeColor,
  };
};
