import type { RGBA } from "../../../utils/colors/colorConversion";

export function convertImageDataToRGBA(
  imageData: ImageData,
  width: number,
  height: number
): RGBA[][] {
  const colorData = imageData.data;
  const rgbaData: RGBA[][] = Array.from({ length: height }, () => []);

  let row = 0;
  let col = 0;
  for (let i = 0; i < colorData.length; i += 4) {
    const r = colorData[i];
    const g = colorData[i + 1];
    const b = colorData[i + 2];
    const a = colorData[i + 3];

    const color: RGBA = { r, g, b, a };

    rgbaData[row].push(color);
    col++;
    if (col === width) {
      col = 0;
      row++;
      if (row >= height) break;
    }
  }

  return rgbaData;
}
