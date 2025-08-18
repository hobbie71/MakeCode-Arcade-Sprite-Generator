import { MakeCodeColor } from "@/types/color";

export function getResizedSpriteData(
  oldData: MakeCodeColor[][],
  newWidth: number,
  newHeight: number
): MakeCodeColor[][] {
  const newData: MakeCodeColor[][] = [];
  for (let y = 0; y < newHeight; y++) {
    const row: MakeCodeColor[] = [];
    for (let x = 0; x < newWidth; x++) {
      row.push(
        oldData[y]?.[x] !== undefined
          ? oldData[y][x]
          : MakeCodeColor.TRANSPARENT
      );
    }
    newData.push(row);
  }
  return newData;
}
