import { MakeCodeColor, MakeCodePalette, ArcadePalette } from "@/types/color";

export function getHexFromColor(
  color: MakeCodeColor,
  palette: MakeCodePalette = ArcadePalette
) {
  return palette[color];
}
