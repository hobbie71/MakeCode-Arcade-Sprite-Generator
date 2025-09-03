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
} from "../../../utils/colors/getMakeCodeColor";

// Util imports
import { calculateHueZones } from "../utils/hueZoneUtils";
import { getRgbaDataFromCanvas } from "../../../utils/getDataFromCanvas";

// Type imports
import { MakeCodeColor } from "../../../types/color";
import { drawSpriteDataOnCanvasTransparent } from "../../SpriteEditor/libs/drawPixelOnCanvas";
import type { HSL, RGB, RGBA } from "../../../utils/colors/colorConversion";
import { PIXEL_SIZE } from "../../SpriteEditor/constants/pixelSize";

export const useMakeCodeColorConverter = () => {
  const { palette } = usePaletteSelected();
  const hueZones = useMemo(() => calculateHueZones(palette), [palette]);

  // Memoized conversion functions
  const getMakeCodeColorFromHsl = useCallback(
    (hsl: HSL): MakeCodeColor => {
      const { h, l } = hsl;
      return hslToMakeCodeColor(h, l, hueZones);
    },
    [hueZones]
  );

  const getMakeCodeColorFromRgb = useCallback(
    (rgb: RGB): MakeCodeColor => {
      const { r, g, b } = rgb;
      return rgbToMakeCodeColor(r, g, b, hueZones);
    },
    [hueZones]
  );

  const getMakeCodeColorFromHex = useCallback(
    (hex: string): MakeCodeColor => {
      return hexToMakeCodeColor(hex, hueZones);
    },
    [hueZones]
  );

  const getMakeCodeColorFromRgba = useCallback(
    (rgba: RGBA, alphaThreshold?: number): MakeCodeColor => {
      const { r, g, b, a } = rgba;
      return rgbaToMakeCodeColor(r, g, b, a, hueZones, alphaThreshold);
    },
    [hueZones]
  );

  const getSpriteDataFromCanvas = useCallback(
    (canvas: HTMLCanvasElement): MakeCodeColor[][] => {
      const rgbaData = getRgbaDataFromCanvas(canvas);
      const spriteData: MakeCodeColor[][] = [];

      for (let y = 0; y < canvas.height; y++) {
        const row: MakeCodeColor[] = [];
        for (let x = 0; x < canvas.width; x++) {
          const { r, g, b, a } = rgbaData[y][x];
          const color = rgbaToMakeCodeColor(r, g, b, a, hueZones);

          row.push(color);
        }
        spriteData.push(row);
      }

      return spriteData;
    },
    [hueZones]
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
    hueZones,
    getMakeCodeColorFromHsl,
    getMakeCodeColorFromRgb,
    getMakeCodeColorFromHex,
    getMakeCodeColorFromRgba,
    getSpriteDataFromCanvas,
    mapCanvasToMakeCodeColors,
  };
};
