import { MakeCodeColor, MakeCodePalette, ArcadePalette } from "@/types/color";
import { hexToRgb, calculateColorDistance, rgbaToHex } from "./colorConversion";

// Build a reverse lookup map for each palette
const paletteHexToColorMap = new WeakMap<
  MakeCodePalette,
  Map<string, MakeCodeColor>
>();

function getPaletteHexToColorMap(
  palette: MakeCodePalette
): Map<string, MakeCodeColor> {
  let map = paletteHexToColorMap.get(palette);
  if (!map) {
    map = new Map<string, MakeCodeColor>();
    for (const [makeCodeColor, colorHex] of Object.entries(palette)) {
      if (colorHex.toLowerCase().startsWith("rgba")) continue;
      map.set(colorHex.toLowerCase(), makeCodeColor as MakeCodeColor);
    }
    paletteHexToColorMap.set(palette, map);
  }
  return map;
}

// Find the closest color in the palette
function findClosestColor(
  targetRgb: { r: number; g: number; b: number },
  palette: MakeCodePalette
): MakeCodeColor {
  let closestColor = MakeCodeColor.BLACK; // Default fallback
  let minDistance = Infinity;

  for (const [makeCodeColor, colorHex] of Object.entries(palette)) {
    // Skip transparent/rgba colors for distance calculation
    if (colorHex.toLowerCase().startsWith("rgba")) continue;

    try {
      const paletteRgb = hexToRgb(colorHex);
      const distance = calculateColorDistance(targetRgb, paletteRgb);

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = makeCodeColor as MakeCodeColor;
      }
    } catch {
      // Skip invalid colors
      continue;
    }
  }

  return closestColor;
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

export function hexToMakeCodeColor(
  hex: string,
  palette: MakeCodePalette = ArcadePalette
): MakeCodeColor {
  // Normalize hex to #RRGGBB
  let normalized = hex.trim().toLowerCase();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }
  // Expand 3-digit hex to 6-digit
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // Remove alpha if present (8 digits)
  if (normalized.length === 8) {
    normalized = normalized.slice(0, 6);
  }
  // Validate hex
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    // For invalid hex, return black as fallback
    return MakeCodeColor.BLACK;
  }
  normalized = "#" + normalized;

  // Use reverse lookup map for performance - exact match first
  const map = getPaletteHexToColorMap(palette);
  const exactMatch = map.get(normalized);

  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, find the closest color
  try {
    const targetRgb = hexToRgb(normalized);
    return findClosestColor(targetRgb, palette);
  } catch {
    // If hex parsing fails, return black as fallback
    return MakeCodeColor.BLACK;
  }
}

export function rgbaToMakeCodeColor(
  r: number,
  g: number,
  b: number,
  a: number = 255,
  palette: MakeCodePalette = ArcadePalette
): MakeCodeColor {
  // If alpha is 0 or low, return transparent
  if (a < 200) {
    return MakeCodeColor.TRANSPARENT;
  }

  const hex = rgbaToHex(r, g, b, a);
  return hexToMakeCodeColor(hex, palette);
}
