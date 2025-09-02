import { hexToHsl, rgbToHsl } from "./colorConversion";
import { MakeCodeColor } from "../../types/color";
import type { HueZone, LuminanceZone } from "../../types/hueZone";

/**
 * Convert HSL values to MakeCode color using zone-based system
 */
export const hslToMakeCodeColor = (
  h: number,
  l: number,
  hueZones: HueZone[]
): MakeCodeColor => {
  // Find the matching hue zone
  const matchingZone = findHueZone(h, hueZones);

  // Find the matching luminance zone within the hue zone
  const matchingLuminanceZone = findLuminanceZone(l, matchingZone);

  return matchingLuminanceZone.color;
};

/**
 * Convert RGB values to MakeCode color
 */
export const rgbToMakeCodeColor = (
  r: number,
  g: number,
  b: number,
  hueZones: HueZone[]
): MakeCodeColor => {
  const hsl = rgbToHsl(r, g, b);
  return hslToMakeCodeColor(hsl.h, hsl.l, hueZones);
};

/**
 * Convert hex color to MakeCode color
 */
export const hexToMakeCodeColor = (
  hex: string,
  hueZones: HueZone[]
): MakeCodeColor => {
  const hsl = hexToHsl(hex);
  return hslToMakeCodeColor(hsl.h, hsl.l, hueZones);
};

/**
 * Convert RGBA values to MakeCode color
 */
export const rgbaToMakeCodeColor = (
  r: number,
  g: number,
  b: number,
  a: number,
  hueZones: HueZone[],
  alphaThreshold: number = 0.5
): MakeCodeColor => {
  // Handle transparency
  if (a < alphaThreshold) {
    return MakeCodeColor.TRANSPARENT;
  }

  return rgbToMakeCodeColor(r, g, b, hueZones);
};

// Helper functions
const findHueZone = (hue: number, hueZones: HueZone[]): HueZone => {
  const zone = hueZones.find((zone) => {
    if (zone.zoneStart <= zone.zoneEnd) {
      // Normal case
      return hue >= zone.zoneStart && hue <= zone.zoneEnd;
    } else {
      // Wrap-around case (crosses 0°)
      return hue >= zone.zoneStart || hue <= zone.zoneEnd;
    }
  });

  if (!zone) throw new Error("can't find HueZone");
  return zone;
};

const findLuminanceZone = (
  luminance: number,
  hueZone: HueZone
): LuminanceZone => {
  const zone = hueZone.luminanceZone.find(
    (zone) => luminance >= zone.zoneStart && luminance <= zone.zoneEnd
  );

  if (!zone) throw new Error("can't find LuminanceZone");
  return zone;
};
