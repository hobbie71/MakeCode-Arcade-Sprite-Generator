import { hexToRgb, rgbToHsl, type RGB, type HSL } from "./colorConversion";
import { MakeCodeColor } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";

const paletteRgbMap = new WeakMap<MakeCodePalette, Map<MakeCodeColor, RGB>>();
const paletteHslMap = new WeakMap<MakeCodePalette, Map<MakeCodeColor, HSL>>();
const paletteHexMap = new WeakMap<
  MakeCodePalette,
  Map<MakeCodeColor, string>
>();

export const getPaletteRgbMap = (
  palette: MakeCodePalette
): Map<MakeCodeColor, RGB> => {
  let map = paletteRgbMap.get(palette);
  if (!map) {
    map = new Map<MakeCodeColor, RGB>();
    for (const [makeCodeColor, colorHex] of Object.entries(palette)) {
      if (colorHex.toLowerCase().startsWith("rgba")) continue;
      try {
        const rgb = hexToRgb(colorHex);
        map.set(makeCodeColor as MakeCodeColor, rgb);
      } catch {
        // Skip invalid colors
      }
    }
    paletteRgbMap.set(palette, map);
  }
  return map;
};

export const getPaletteHslMap = (
  palette: MakeCodePalette
): Map<MakeCodeColor, HSL> => {
  let map = paletteHslMap.get(palette);
  if (!map) {
    map = new Map<MakeCodeColor, HSL>();
    const rgbMap = getPaletteRgbMap(palette);
    for (const [makeCodeColor, rgb] of rgbMap.entries()) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      map.set(makeCodeColor, hsl);
    }
    paletteHslMap.set(palette, map);
  }
  return map;
};

export const getPaletteHexMap = (
  palette: MakeCodePalette
): Map<MakeCodeColor, string> => {
  let map = paletteHexMap.get(palette);
  if (!map) {
    map = new Map<MakeCodeColor, string>();
    // Use palette directly since it already contains hex values
    for (const [makeCodeColor, colorHex] of Object.entries(palette)) {
      if (colorHex.toLowerCase().startsWith("rgba")) continue;
      map.set(makeCodeColor as MakeCodeColor, colorHex);
    }
    paletteHexMap.set(palette, map);
  }
  return map;
};
