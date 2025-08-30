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
} from "../libs/converters";
import { convertImageDataToRGBA } from "../libs/convertImageDataToRGBA";

// Util imports
import { calculateHueZones } from "../utils/hueZoneUtils";

// Type imports
import { MakeCodeColor } from "../../../types/color";

export const useColorToMakeCodeConverter = () => {
  const { palette } = usePaletteSelected();
  const hueZones = useMemo(() => calculateHueZones(palette), [palette]);

  // Memoized conversion functions
  const convertHsl = useCallback(
    (h: number, l: number): MakeCodeColor => {
      return hslToMakeCodeColor(h, l, hueZones);
    },
    [hueZones]
  );

  const convertRgb = useCallback(
    (r: number, g: number, b: number): MakeCodeColor => {
      return rgbToMakeCodeColor(r, g, b, hueZones);
    },
    [hueZones]
  );

  const convertHex = useCallback(
    (hex: string): MakeCodeColor => {
      return hexToMakeCodeColor(hex, hueZones);
    },
    [hueZones]
  );

  const convertRgba = useCallback(
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

  const convertImage = useCallback(
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

  return {
    hueZones,
    convertHsl,
    convertRgb,
    convertHex,
    convertRgba,
    convertImage,
  };
};
