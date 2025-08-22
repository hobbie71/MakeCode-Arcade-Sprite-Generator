import { MakeCodeColor } from "@/types";
import { MakeCodePalette } from "@/types/color";
import { rgbaToMakeCodeColor } from "@/utils/colorUtils";

export function convertImageDataToSpriteData(
  imageData: ImageData,
  width: number,
  palette: MakeCodePalette
): MakeCodeColor[][] {
  const colorData = imageData.data;
  const height = Math.ceil(colorData.length / 4 / width);
  const spriteData: MakeCodeColor[][] = Array.from(
    { length: height },
    () => []
  );

  let row = 0;
  let col = 0;
  for (let i = 0; i < colorData.length; i += 4) {
    const r = colorData[i];
    const g = colorData[i + 1];
    const b = colorData[i + 2];
    const a = colorData[i + 3];

    let color: MakeCodeColor;
    if (a === 0) {
      color = MakeCodeColor.TRANSPARENT;
    } else {
      const maybeColor = rgbaToMakeCodeColor(r, g, b, a, palette);
      if (maybeColor !== undefined) {
        color = maybeColor;
      } else {
        color = MakeCodeColor.TRANSPARENT;
      }
    }
    spriteData[row].push(color);
    col++;
    if (col === width) {
      col = 0;
      row++;
      if (row >= height) break;
    }
  }

  return spriteData;
}
