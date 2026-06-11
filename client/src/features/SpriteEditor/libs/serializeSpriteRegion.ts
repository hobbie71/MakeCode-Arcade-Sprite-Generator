import { MakeCodeColor } from "../../../types/color";
import { maskBounds, maskGet } from "./selectionMask";
import type { SelectionMask } from "./selectionMask";

/**
 * Crop the sprite to a selection's bounding box, blanking cells outside the
 * mask to TRANSPARENT. The result is a tight rectangular grid suitable for the
 * clipboard (serialized as a MakeCode `img` literal) or for seeding a floating
 * paste. Returns null when the mask is empty.
 */
export const cropMaskedRegion = (
  data: MakeCodeColor[][],
  mask: SelectionMask
): MakeCodeColor[][] | null => {
  const b = maskBounds(mask);
  if (!b) return null;
  const region: MakeCodeColor[][] = [];
  for (let y = b.minY; y <= b.maxY; y++) {
    const row: MakeCodeColor[] = [];
    for (let x = b.minX; x <= b.maxX; x++) {
      row.push(
        maskGet(mask, x, y)
          ? (data[y]?.[x] ?? MakeCodeColor.TRANSPARENT)
          : MakeCodeColor.TRANSPARENT
      );
    }
    region.push(row);
  }
  return region;
};

/** A region grid as a MakeCode `img` image-literal (rows of 1-char indices). */
export const regionToImgLiteral = (region: MakeCodeColor[][]): string => {
  const lines = region.map((row) => row.join(""));
  return `img\`\n${lines.join("\n")}\n\``;
};
