import { MakeCodeColor, ArcadePalette } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";
import type { RGBA, HSLA } from "./colorConversion";
import { hexToRgba, hexToHsla } from "./colorConversion";

export const getHexFromMakeCodeColor = (
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
): string => {
  // Fallback to transparent if color not found
  return (
    palette[color] ?? palette[MakeCodeColor.TRANSPARENT] ?? "rgba(0,0,0,0)"
  );
};

export const getRgbaFromMakeCodeColor = (
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
): RGBA => {
  const hex = getHexFromMakeCodeColor(color, palette);
  return hexToRgba(hex);
};

export const getHslaFromMakeCodeColor = (
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
): HSLA => {
  const hex = getHexFromMakeCodeColor(color, palette);
  return hexToHsla(hex);
};
