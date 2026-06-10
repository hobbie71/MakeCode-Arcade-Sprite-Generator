import type { Coordinates } from "../../../types/pixel";

/**
 * A selection as a whole-canvas 1-bit mask (row-major, 1 = selected). Every
 * selection tool (rectangle, wand, lasso) produces one of these, so everything
 * downstream — marching ants, lift/move, combine modes — works on a single
 * representation regardless of how the selection was made (ADR-0007).
 */
export interface SelectionMask {
  width: number;
  height: number;
  bits: Uint8Array;
}

/** Inclusive bounding box of the selected bits, in sprite-pixel coords. */
export interface MaskBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export type MaskCombineMode = "replace" | "add" | "subtract";

export const createMask = (width: number, height: number): SelectionMask => ({
  width,
  height,
  bits: new Uint8Array(width * height),
});

/** Out-of-range coordinates read as unselected. */
export const maskGet = (mask: SelectionMask, x: number, y: number): boolean =>
  x >= 0 &&
  y >= 0 &&
  x < mask.width &&
  y < mask.height &&
  mask.bits[y * mask.width + x] === 1;

export const maskSet = (
  mask: SelectionMask,
  x: number,
  y: number,
  on: boolean
): void => {
  if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) return;
  mask.bits[y * mask.width + x] = on ? 1 : 0;
};

/** Rectangle between two corners (any drag direction), clamped to the canvas. */
export const maskFromRect = (
  width: number,
  height: number,
  a: Coordinates,
  b: Coordinates
): SelectionMask => {
  const mask = createMask(width, height);
  const minX = Math.max(0, Math.min(a.x, b.x));
  const maxX = Math.min(width - 1, Math.max(a.x, b.x));
  const minY = Math.max(0, Math.min(a.y, b.y));
  const maxY = Math.min(height - 1, Math.max(a.y, b.y));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      mask.bits[y * width + x] = 1;
    }
  }
  return mask;
};

export const fullMask = (width: number, height: number): SelectionMask => {
  const mask = createMask(width, height);
  mask.bits.fill(1);
  return mask;
};

/**
 * Combine an incoming tool-produced mask with the existing selection.
 * "replace" ignores the base; "add"/"subtract" are the Shift/Alt drag modes.
 */
export const combineMasks = (
  base: SelectionMask | null,
  incoming: SelectionMask,
  mode: MaskCombineMode
): SelectionMask => {
  if (mode === "replace") return incoming;
  if (!base) {
    // Adding to nothing is the incoming mask; subtracting from nothing is nothing.
    return mode === "add" ? incoming : createMask(incoming.width, incoming.height);
  }
  const out = createMask(incoming.width, incoming.height);
  const n = out.bits.length;
  if (mode === "add") {
    for (let i = 0; i < n; i++) out.bits[i] = base.bits[i] | incoming.bits[i];
  } else {
    for (let i = 0; i < n; i++)
      out.bits[i] = base.bits[i] === 1 && incoming.bits[i] === 0 ? 1 : 0;
  }
  return out;
};

export const maskIsEmpty = (mask: SelectionMask): boolean => {
  const n = mask.bits.length;
  for (let i = 0; i < n; i++) if (mask.bits[i] === 1) return false;
  return true;
};

export const maskBounds = (mask: SelectionMask): MaskBounds | null => {
  let minX = mask.width;
  let minY = mask.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (mask.bits[y * mask.width + x] !== 1) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return maxX === -1 ? null : { minX, minY, maxX, maxY };
};
