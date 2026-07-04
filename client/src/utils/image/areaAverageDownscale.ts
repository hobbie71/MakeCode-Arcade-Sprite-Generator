/**
 * Area-average ("box filter") downscale in LINEAR light with premultiplied
 * alpha — improvement #2 from
 * docs/design/color-and-conversion-improvement-research.md.
 *
 * The production pipeline currently quantizes at full resolution and then
 * downscales with nearest-neighbour (`scaleCanvasToTarget`, imageSmoothing off).
 * Nearest-neighbour *point-samples* one source pixel per destination cell and
 * throws the other ~thousands away, so thin features (a 1px black outline) are
 * dropped at random and detail turns to confetti.
 *
 * Area-averaging instead accumulates every source pixel that falls under a
 * destination cell, so a feature's *energy* survives: a dark outline averaged
 * into a cell darkens it (it becomes a dark pixel) instead of vanishing.
 *
 * Two correctness details the naive `ctx.drawImage` downscale gets wrong:
 *   1. Averaging happens in **linear light** (sRGB is gamma-encoded; averaging
 *      raw bytes shifts colours lighter and muddier — the brown→orange drift).
 *   2. Colour is weighted by **alpha** (premultiplied) so transparent pixels
 *      don't leak their RGB into the average along a cut-out edge.
 *
 * The framing contract mirrors `scaleCanvasToTarget`: the source is scaled to
 * *contain* it within (targetWidth × targetHeight), preserving aspect ratio and
 * centring, with the margin left fully transparent. This makes it a drop-in
 * replacement for the final scale step when running the pipeline downscale-first.
 */
import { srgbToLinear, linearToSrgb } from "../colors/srgbLinear";
import { createCanvas2D } from "./canvas";

/** Precomputed sRGB-byte → linear-light LUT (256 entries), built once. */
const SRGB_TO_LINEAR: Float64Array = (() => {
  const lut = new Float64Array(256);
  for (let i = 0; i < 256; i++) lut[i] = srgbToLinear(i);
  return lut;
})();

/** The source-pixel span covered by one destination cell along an axis. */
interface Span {
  lo: number; // fractional start of the cell in source space
  hi: number; // fractional end
  first: number; // first source index to visit
  last: number; // one past the last source index
}

const axisSpan = (dest: number, scale: number, sourceMax: number): Span => {
  const lo = dest * scale;
  const hi = (dest + 1) * scale;
  return { lo, hi, first: Math.floor(lo), last: Math.min(sourceMax, Math.ceil(hi)) };
};

/**
 * Average one destination cell: the source rectangle (xs × ys), fractional
 * edges included, weighted by alpha, accumulated in linear light. Returns the
 * re-encoded [r, g, b, a] sRGB bytes (transparent when nothing covers it).
 */
const averageCell = (
  src: Uint8ClampedArray,
  sourceWidth: number,
  xs: Span,
  ys: Span
): [number, number, number, number] => {
  let accR = 0;
  let accG = 0;
  let accB = 0;
  let accA = 0; // Σ(alpha01 · coverage) — the colour normaliser
  let accW = 0; // Σ(coverage) — the alpha normaliser

  // Every (sx, sy) in [first, last) provably overlaps the cell, so the coverage
  // weights are always > 0 — no per-pixel skip guard needed.
  for (let sy = ys.first; sy < ys.last; sy++) {
    const wy = Math.min(ys.hi, sy + 1) - Math.max(ys.lo, sy);
    const rowBase = sy * sourceWidth;

    for (let sx = xs.first; sx < xs.last; sx++) {
      const wx = Math.min(xs.hi, sx + 1) - Math.max(xs.lo, sx);
      const i = (rowBase + sx) * 4;
      const aw = (src[i + 3] / 255) * wx * wy;
      accR += SRGB_TO_LINEAR[src[i]] * aw;
      accG += SRGB_TO_LINEAR[src[i + 1]] * aw;
      accB += SRGB_TO_LINEAR[src[i + 2]] * aw;
      accA += aw;
      accW += wx * wy;
    }
  }

  if (accA <= 0) return [0, 0, 0, 0];
  return [
    Math.round(linearToSrgb(accR / accA)),
    Math.round(linearToSrgb(accG / accA)),
    Math.round(linearToSrgb(accB / accA)),
    Math.round((accA / accW) * 255),
  ];
};

/**
 * Area-average `source` down to exactly (destWidth × destHeight), returning raw
 * ImageData. Each destination cell covers the source rectangle it maps to and
 * averages every overlapping source pixel (fractional edges) via `averageCell`.
 */
const downscaleExact = (
  source: HTMLCanvasElement,
  destWidth: number,
  destHeight: number
): ImageData => {
  const srcCtx = source.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) throw new Error("areaAverageDownscale: failed to read source");
  const { width: srcW, height: srcH } = source;
  const src = srcCtx.getImageData(0, 0, srcW, srcH).data;

  const out = new ImageData(destWidth, destHeight);
  const scaleX = srcW / destWidth;
  const scaleY = srcH / destHeight;

  for (let dy = 0; dy < destHeight; dy++) {
    const ys = axisSpan(dy, scaleY, srcH);
    for (let dx = 0; dx < destWidth; dx++) {
      const [r, g, b, a] = averageCell(src, srcW, axisSpan(dx, scaleX, srcW), ys);
      const di = (dy * destWidth + dx) * 4;
      out.data[di] = r;
      out.data[di + 1] = g;
      out.data[di + 2] = b;
      out.data[di + 3] = a;
    }
  }

  return out;
};

/**
 * Downscale `source` so its content fits within (targetWidth × targetHeight),
 * area-averaging in linear light. Returns a target-sized canvas with the scaled
 * content centred and a transparent margin.
 */
export const areaAverageDownscale = (
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
  const sourceAspect = source.width / source.height;
  const targetAspect = targetWidth / targetHeight;

  // "Contain" fit — identical maths to scaleCanvasToTarget so framing matches.
  let drawWidth: number;
  let drawHeight: number;
  if (sourceAspect > targetAspect) {
    drawWidth = targetWidth;
    drawHeight = Math.max(1, Math.round(targetWidth / sourceAspect));
  } else {
    drawHeight = targetHeight;
    drawWidth = Math.max(1, Math.round(targetHeight * sourceAspect));
  }

  const scaled = downscaleExact(source, drawWidth, drawHeight);

  const { canvas: target, ctx } = createCanvas2D(targetWidth, targetHeight);
  const offsetX = Math.floor((targetWidth - drawWidth) / 2);
  const offsetY = Math.floor((targetHeight - drawHeight) / 2);
  ctx.putImageData(scaled, offsetX, offsetY);
  return target;
};
