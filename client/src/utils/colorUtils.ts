import { MakeCodeColor, ArcadePalette } from "../types/color";
import type { MakeCodePalette } from "../types/color";
import { hexToRgb, rgbToHsl, type RGB, type HSL } from "./colorConversion";

// Build a reverse lookup map for each palette with RGB values
const paletteRgbMap = new WeakMap<MakeCodePalette, Map<MakeCodeColor, RGB>>();
const paletteHslMap = new WeakMap<MakeCodePalette, Map<MakeCodeColor, HSL>>();

function getPaletteRgbMap(palette: MakeCodePalette): Map<MakeCodeColor, RGB> {
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
}

export function getPaletteHslMap(
  palette: MakeCodePalette
): Map<MakeCodeColor, HSL> {
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
}

export function getHexFromMakeCodeColor(
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
): string {
  // Fallback to transparent if color not found
  return (
    palette[color] ?? palette[MakeCodeColor.TRANSPARENT] ?? "rgba(0,0,0,0)"
  );
}
