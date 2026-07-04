/**
 * Outline / edge preservation pass — improvement #3 from
 * docs/design/color-and-conversion-improvement-research.md.
 *
 * Even with a proper area-average downscale (#2), a 1px black cartoon outline
 * blends with its neighbours as it shrinks and can snap to a mid-tone instead of
 * black, so the crisp "inked" border softens. This pass finds where the source
 * actually had a *dark edge* and forces those sprite pixels to the palette's
 * darkest colour after quantization — guaranteeing "if it had a black border,
 * it keeps a black border."
 *
 * The rule is deliberately conservative so it preserves real ink outlines
 * without smearing black onto every silhouette:
 *
 *     outline(pixel) = isDark(pixel) AND ( isStrongEdge(pixel) OR touchesTransparency(pixel) )
 *
 * - isDark gates on luminance, so a bright silhouette (e.g. a gold coin rim
 *   meeting the background) is never forced to black — only genuinely dark
 *   borders are.
 * - isStrongEdge (Sobel gradient magnitude) catches interior ink lines
 *   (chest slats, a visor grille).
 * - touchesTransparency catches the outer silhouette outline after background
 *   removal, where the dark border meets cut-out transparency.
 *
 * The mask is computed from the downscaled RGBA *reference* (target resolution),
 * so it can be applied identically to any quantized sprite of that size — which
 * is what lets the comparison harness isolate the effect of this pass alone.
 */
import { MakeCodeColor } from "../../types/color";
import type { PaletteLab } from "../colors/oklab";
import { DEFAULT_ALPHA_THRESHOLD } from "../colors/oklab";

export interface OutlineMaskOptions {
  /** Alpha below this (0–255) is treated as background, not subject. */
  alphaThreshold?: number;
  /** Luminance (0–1) below this counts as "dark" — an ink candidate. */
  darkLuma?: number;
  /** Sobel gradient magnitude above this counts as a strong interior edge. */
  edgeThreshold?: number;
}

const DEFAULTS: Required<OutlineMaskOptions> = {
  alphaThreshold: DEFAULT_ALPHA_THRESHOLD,
  darkLuma: 0.32,
  edgeThreshold: 0.5,
};

const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

/** Perceptual luma (Rec.709) of an sRGB byte triple, normalised to 0–1. */
const luma = (r: number, g: number, b: number): number =>
  (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/**
 * Luminance field for the whole image. Transparent pixels are set bright (1.0)
 * so the Sobel step does not read them as dark interior edges — the silhouette
 * is handled separately by the touches-transparency test.
 */
const buildLumaField = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold: number
): Float64Array => {
  const field = new Float64Array(width * height);
  for (let p = 0, i = 0; p < field.length; p++, i += 4) {
    field[p] =
      data[i + 3] >= alphaThreshold ? luma(data[i], data[i + 1], data[i + 2]) : 1.0;
  }
  return field;
};

/** Edge-clamped sample of the luminance field. */
const sampleLuma = (
  field: Float64Array,
  width: number,
  height: number,
  x: number,
  y: number
): number => {
  const cx = x < 0 ? 0 : x >= width ? width - 1 : x;
  const cy = y < 0 ? 0 : y >= height ? height - 1 : y;
  return field[cy * width + cx];
};

/** Sobel gradient magnitude of the luminance field at (x, y). */
const sobelMagnitude = (
  field: Float64Array,
  width: number,
  height: number,
  x: number,
  y: number
): number => {
  const s = (dx: number, dy: number) => sampleLuma(field, width, height, x + dx, y + dy);
  const gx = s(-1, -1) + 2 * s(-1, 0) + s(-1, 1) - (s(1, -1) + 2 * s(1, 0) + s(1, 1));
  const gy = s(-1, -1) + 2 * s(0, -1) + s(1, -1) - (s(-1, 1) + 2 * s(0, 1) + s(1, 1));
  return Math.hypot(gx, gy);
};

type OpaqueFn = (x: number, y: number) => boolean;

/** True if (x, y) borders a transparent pixel or the image edge. */
const touchesTransparency = (
  opaque: OpaqueFn,
  width: number,
  height: number,
  x: number,
  y: number
): boolean =>
  NEIGHBOURS.some(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    return nx < 0 || nx >= width || ny < 0 || ny >= height || !opaque(nx, ny);
  });

/**
 * Compute the boolean outline mask for a downscaled RGBA reference image.
 * `mask[y][x] === true` means "this pixel is a dark edge — force it to the
 * darkest palette colour."
 */
export const computeOutlineMask = (
  ref: ImageData,
  options: OutlineMaskOptions = {}
): boolean[][] => {
  const { alphaThreshold, darkLuma, edgeThreshold } = { ...DEFAULTS, ...options };
  const { width, height, data } = ref;
  const opaque: OpaqueFn = (x, y) => data[(y * width + x) * 4 + 3] >= alphaThreshold;
  const field = buildLumaField(data, width, height, alphaThreshold);

  const isOutline = (x: number, y: number): boolean => {
    if (!opaque(x, y)) return false;
    const i = (y * width + x) * 4;
    if (luma(data[i], data[i + 1], data[i + 2]) >= darkLuma) return false;
    const strongEdge = sobelMagnitude(field, width, height, x, y) > edgeThreshold;
    return strongEdge || touchesTransparency(opaque, width, height, x, y);
  };

  const mask: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) row.push(isOutline(x, y));
    mask.push(row);
  }
  return mask;
};

/** The opaque palette colour with the lowest OKLab lightness (the "ink"). */
export const darkestPaletteColor = (paletteLab: PaletteLab[]): MakeCodeColor => {
  if (paletteLab.length === 0) return MakeCodeColor.BLACK;
  let darkest = paletteLab[0];
  for (const entry of paletteLab) {
    if (entry.lab.L < darkest.lab.L) darkest = entry;
  }
  return darkest.color;
};

/**
 * Apply an outline mask to a quantized sprite grid, forcing masked pixels to
 * `darkColor`. Only pixels that are already opaque in the sprite are recoloured,
 * so the pass never paints ink into the transparent margin.
 */
export const applyOutlineMask = (
  spriteData: MakeCodeColor[][],
  mask: boolean[][],
  darkColor: MakeCodeColor
): MakeCodeColor[][] =>
  spriteData.map((row, y) =>
    row.map((color, x) =>
      mask[y]?.[x] && color !== MakeCodeColor.TRANSPARENT ? darkColor : color
    )
  );
