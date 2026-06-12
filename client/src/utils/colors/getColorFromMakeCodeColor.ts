import { MakeCodeColor, ArcadePalette } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";

export const getHexFromMakeCodeColor = (
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
): string => {
  // Fallback to transparent if color not found
  return (
    palette[color] ?? palette[MakeCodeColor.TRANSPARENT] ?? "rgba(0,0,0,0)"
  );
};
