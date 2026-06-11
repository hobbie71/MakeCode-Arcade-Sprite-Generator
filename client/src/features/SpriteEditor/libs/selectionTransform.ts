import { MakeCodeColor } from "../../../types/color";
import { createMask, maskGet, maskSet } from "./selectionMask";
import type { SelectionMask } from "./selectionMask";

/**
 * Nearest-neighbor resample of the lifted basis (pixels + mask) into a target
 * w×h, honoring horizontal/vertical flips. Always sampling from the ORIGINAL
 * basis — never the previously-rendered result — is what keeps repeated
 * resizes from compounding quality loss (MakeCode's originalImage trick,
 * ADR-0007 decision 7).
 */
export const deriveFloatingPixels = (
  basisData: MakeCodeColor[][],
  basisMask: SelectionMask,
  targetW: number,
  targetH: number,
  flipX: boolean,
  flipY: boolean
): { data: MakeCodeColor[][]; mask: SelectionMask } => {
  const srcW = basisMask.width;
  const srcH = basisMask.height;
  const w = Math.max(1, targetW);
  const h = Math.max(1, targetH);

  const data: MakeCodeColor[][] = [];
  const mask = createMask(w, h);

  for (let y = 0; y < h; y++) {
    const row: MakeCodeColor[] = [];
    // Map destination cell center back to a source cell.
    let sy = Math.min(srcH - 1, Math.floor((y * srcH) / h));
    if (flipY) sy = srcH - 1 - sy;
    for (let x = 0; x < w; x++) {
      let sx = Math.min(srcW - 1, Math.floor((x * srcW) / w));
      if (flipX) sx = srcW - 1 - sx;
      const selected = maskGet(basisMask, sx, sy);
      maskSet(mask, x, y, selected);
      row.push(
        selected
          ? (basisData[sy]?.[sx] ?? MakeCodeColor.TRANSPARENT)
          : MakeCodeColor.TRANSPARENT
      );
    }
    data.push(row);
  }

  return { data, mask };
};

// ---- Lossless ops folded into the basis (no resampling) -------------------

export const flipDataH = (data: MakeCodeColor[][]): MakeCodeColor[][] =>
  data.map((row) => [...row].reverse());

export const flipDataV = (data: MakeCodeColor[][]): MakeCodeColor[][] =>
  [...data].reverse().map((row) => [...row]);

export const flipMaskH = (mask: SelectionMask): SelectionMask => {
  const out = createMask(mask.width, mask.height);
  for (let y = 0; y < mask.height; y++)
    for (let x = 0; x < mask.width; x++)
      maskSet(out, mask.width - 1 - x, y, maskGet(mask, x, y));
  return out;
};

export const flipMaskV = (mask: SelectionMask): SelectionMask => {
  const out = createMask(mask.width, mask.height);
  for (let y = 0; y < mask.height; y++)
    for (let x = 0; x < mask.width; x++)
      maskSet(out, x, mask.height - 1 - y, maskGet(mask, x, y));
  return out;
};

/** Rotate clockwise 90°: result is height×width of the source. */
export const rotateData90 = (data: MakeCodeColor[][]): MakeCodeColor[][] => {
  const h = data.length;
  const w = data[0]?.length ?? 0;
  const out: MakeCodeColor[][] = [];
  for (let x = 0; x < w; x++) {
    const row: MakeCodeColor[] = [];
    for (let y = h - 1; y >= 0; y--) row.push(data[y][x]);
    out.push(row);
  }
  return out;
};

export const rotateMask90 = (mask: SelectionMask): SelectionMask => {
  const out = createMask(mask.height, mask.width);
  for (let y = 0; y < mask.height; y++)
    for (let x = 0; x < mask.width; x++)
      maskSet(out, mask.height - 1 - y, x, maskGet(mask, x, y));
  return out;
};
