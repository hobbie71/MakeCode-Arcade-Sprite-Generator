import type { Coordinates } from "../../../types/pixel";
import type { MakeCodeColor } from "../../../types/color";
import { getLineCoordinates } from "./getShapeCoordinates";

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
 * Magic-wand mask from a click. The canvas is palette-indexed (exact colors),
 * so there's no tolerance — cells match the clicked cell's color exactly.
 *   contiguous=true  → 4-connected flood of the clicked region (default; the
 *                      8-connected variant leaks through 1px diagonal outlines)
 *   contiguous=false → every cell of that color anywhere (global same-color)
 * Mirrors the fill tool's flood/fillAll split (useFill.ts), but accumulates
 * mask bits instead of painting.
 */
export const maskFromFlood = (
  data: MakeCodeColor[][],
  width: number,
  height: number,
  start: Coordinates,
  contiguous: boolean
): SelectionMask => {
  const mask = createMask(width, height);
  if (start.x < 0 || start.y < 0 || start.x >= width || start.y >= height)
    return mask;
  const target = data[start.y]?.[start.x];
  if (target === undefined) return mask;

  if (!contiguous) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[y][x] === target) mask.bits[y * width + x] = 1;
      }
    }
    return mask;
  }

  const stack: Coordinates[] = [start];
  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const i = y * width + x;
    if (mask.bits[i] === 1) continue;
    if (data[y][x] !== target) continue;
    mask.bits[i] = 1;
    stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
  }
  return mask;
};

/**
 * Combine an incoming tool-produced mask with the existing selection.
 * "replace" ignores the base; "add"/"subtract" are the Shift/Alt drag modes.
 */
/**
 * Mask from a freehand/lasso path (a list of sampled pixel points). The outline
 * is densified with Bresenham and closed back to the start, rasterized into a
 * 1px-padded scratch grid; the exterior is flood-filled from the padded corner
 * and inverted, then the outline is OR'd back in. This is robust to
 * self-intersecting scribbles (where scanline even-odd fill misbehaves) and
 * reuses the same flood shape as the wand. A degenerate path (one cell) selects
 * just that cell.
 */
export const maskFromLassoPath = (
  width: number,
  height: number,
  path: Coordinates[]
): SelectionMask => {
  const mask = createMask(width, height);
  if (path.length === 0) return mask;

  // Outline pixels: densify between consecutive samples + close the loop.
  const outline: Coordinates[] = [];
  for (let i = 0; i < path.length; i++) {
    const a = path[i];
    const b = path[(i + 1) % path.length];
    const seg = getLineCoordinates(a, b);
    // Drop the duplicated segment endpoint shared with the next segment's start.
    for (let j = 0; j < seg.length - 1; j++) outline.push(seg[j]);
  }

  // Stamp outline into the selection (clamped) and into a padded scratch grid
  // (pw×ph, offset by +1) so the exterior wraps fully around the shape.
  const pw = width + 2;
  const ph = height + 2;
  const isOutline = new Uint8Array(pw * ph);
  for (const p of outline) {
    if (p.x >= 0 && p.y >= 0 && p.x < width && p.y < height) {
      mask.bits[p.y * width + p.x] = 1;
    }
    const sx = p.x + 1;
    const sy = p.y + 1;
    if (sx >= 0 && sy >= 0 && sx < pw && sy < ph) isOutline[sy * pw + sx] = 1;
  }

  // Flood the exterior from the padded corner (always outside the outline).
  const outside = new Uint8Array(pw * ph);
  const stack: number[] = [0];
  while (stack.length > 0) {
    const idx = stack.pop()!;
    if (outside[idx] || isOutline[idx]) continue;
    outside[idx] = 1;
    const x = idx % pw;
    const y = (idx - x) / pw;
    if (x + 1 < pw) stack.push(idx + 1);
    if (x - 1 >= 0) stack.push(idx - 1);
    if (y + 1 < ph) stack.push(idx + pw);
    if (y - 1 >= 0) stack.push(idx - pw);
  }

  // Interior = not exterior. Map padded scratch back to canvas coords.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!outside[(y + 1) * pw + (x + 1)]) mask.bits[y * width + x] = 1;
    }
  }
  return mask;
};

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
