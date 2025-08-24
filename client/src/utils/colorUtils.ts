import { MakeCodeColor, MakeCodePalette, ArcadePalette } from "@/types/color";
import {
  hexToRgb,
  calculateColorDistance,
  rgbToHsl,
  type RGB,
  type HSL,
} from "./colorConversion";

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

/**
 * Legacy RGB to MakeCode color conversion with tolerance (kept for backward compatibility)
 * @deprecated Use the new zone-based conversion system instead
 */
export function rgbToMakeCodeColor(
  r: number,
  g: number,
  b: number,
  tolerance: number = 30,
  palette: MakeCodePalette = ArcadePalette
): MakeCodeColor {
  const rgbMap = getPaletteRgbMap(palette);
  const candidateColors: { color: MakeCodeColor; distance: number }[] = [];

  // Find all colors within tolerance
  for (const [makeCodeColor, paletteRgb] of rgbMap.entries()) {
    const rDiff = Math.abs(r - paletteRgb.r);
    const gDiff = Math.abs(g - paletteRgb.g);
    const bDiff = Math.abs(b - paletteRgb.b);

    // Check if all RGB channels are within tolerance
    if (rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance) {
      const distance = calculateColorDistance({ r, g, b }, paletteRgb);
      candidateColors.push({ color: makeCodeColor, distance });
    }
  }

  // If we have candidates within tolerance, return the closest one
  if (candidateColors.length > 0) {
    candidateColors.sort((a, b) => a.distance - b.distance);
    return candidateColors[0].color;
  }

  // If no colors within tolerance, find the closest color overall
  let closestColor = MakeCodeColor.BLACK;
  let minDistance = Infinity;

  for (const [makeCodeColor, paletteRgb] of rgbMap.entries()) {
    const distance = calculateColorDistance({ r, g, b }, paletteRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = makeCodeColor;
    }
  }

  return closestColor;
}
