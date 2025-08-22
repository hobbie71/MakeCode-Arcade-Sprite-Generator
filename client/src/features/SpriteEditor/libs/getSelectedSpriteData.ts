import { MakeCodeColor } from "@/types/color";
import { SelectionArea } from "@/types/pixel";

export function getSelectedSpriteData(
  spriteData: MakeCodeColor[][],
  selectedArea: SelectionArea
): MakeCodeColor[][] {
  const { start, end } = selectedArea;

  const selectedSpriteData: MakeCodeColor[][] = [];

  for (let y = start.y; y < end.y; y++) {
    const row: MakeCodeColor[] = [];
    selectedSpriteData.push(row);
    for (let x = start.x; x < end.x; x++) {
      row.push(spriteData[y][x]);
    }
  }

  return selectedSpriteData;
}
