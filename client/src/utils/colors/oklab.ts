/**
 * OKLab perceptual colour matching — the production image→sprite colour matcher
 * (see docs/design/color-and-conversion-improvement-research.md).
 *
 * Every source pixel is snapped to the nearest of the active palette's colours
 * by straight-line distance in OKLab, a perceptually-uniform space where
 * distance tracks how different two colours *look* — respecting lightness AND
 * chroma AND hue together. That is what makes grey map to a neutral (not red)
 * and a muted dark orange map to brown (not bright orange) — the two failure
 * modes of the previous hue/luminance-zone matcher, which ignored saturation.
 * (OKLab is the Cartesian form; OKLCH is the same space in cylindrical coords —
 * distance is identical, so we use OKLab.)
 *
 * Björn Ottosson's transform: https://bottosson.github.io/posts/oklab/
 */
import { srgbToLinear } from "./srgbLinear";
import { MakeCodeColor } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

/** Convert linear-light RGB (each 0–1) to OKLab. */
const linearRgbToOklab = (r: number, g: number, b: number): Oklab => {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
};

/** Convert a gamma-encoded sRGB colour (each channel 0–255) to OKLab. */
export const srgbToOklab = (r: number, g: number, b: number): Oklab =>
  linearRgbToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));

/** Squared Euclidean distance in OKLab (cheap; monotonic with real distance). */
const oklabDistanceSq = (c1: Oklab, c2: Oklab): number => {
  const dL = c1.L - c2.L;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return dL * dL + da * da + db * db;
};

export interface PaletteLab {
  color: MakeCodeColor;
  lab: Oklab;
}

/**
 * Pre-convert every *opaque* palette colour to OKLab. Transparent is excluded —
 * it isn't a colour the matcher should ever snap an opaque pixel to (alpha is
 * handled separately by the caller's threshold).
 */
export const buildPaletteLab = (palette: MakeCodePalette): PaletteLab[] => {
  const out: PaletteLab[] = [];
  for (const [key, value] of Object.entries(palette)) {
    const color = key as MakeCodeColor;
    if (color === MakeCodeColor.TRANSPARENT) continue;
    if (value.toLowerCase().startsWith("rgba")) continue; // skip non-hex
    const hex = value.replace(/^#/, "");
    if (!/^[0-9a-f]{6}$/i.test(hex)) continue;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    out.push({ color, lab: srgbToOklab(r, g, b) });
  }
  return out;
};

/** Nearest palette colour to an sRGB pixel, using a pre-built OKLab palette. */
export const nearestPaletteColorFromLab = (
  r: number,
  g: number,
  b: number,
  paletteLab: PaletteLab[]
): MakeCodeColor => {
  if (paletteLab.length === 0) {
    throw new Error(
      "nearestPaletteColorFromLab: palette has no opaque colours to match against"
    );
  }
  const target = srgbToOklab(r, g, b);
  let best = paletteLab[0].color;
  let bestDist = Infinity;
  for (const entry of paletteLab) {
    const dist = oklabDistanceSq(target, entry.lab);
    if (dist < bestDist) {
      bestDist = dist;
      best = entry.color;
    }
  }
  return best;
};

/** Default alpha cutoff (0–255): pixels below this snap to TRANSPARENT. */
export const DEFAULT_ALPHA_THRESHOLD = 127;

/**
 * Snap an RGBA pixel to a MakeCode palette colour — the production per-pixel
 * entry point. Pixels below the alpha threshold become TRANSPARENT; the rest
 * map to their nearest opaque palette colour. Callers pre-build `paletteLab`
 * once with buildPaletteLab and reuse it across the whole image.
 */
export const rgbaToMakeCodeColor = (
  r: number,
  g: number,
  b: number,
  a: number,
  paletteLab: PaletteLab[],
  alphaThreshold: number = DEFAULT_ALPHA_THRESHOLD
): MakeCodeColor =>
  a < alphaThreshold
    ? MakeCodeColor.TRANSPARENT
    : nearestPaletteColorFromLab(r, g, b, paletteLab);

/**
 * Convenience one-shot: nearest palette colour to an sRGB pixel. Rebuilds the
 * OKLab palette every call — fine for tests/ad-hoc use; hot loops should build
 * the palette once with buildPaletteLab and reuse nearestPaletteColorFromLab.
 */
export const oklabNearestColor = (
  r: number,
  g: number,
  b: number,
  palette: MakeCodePalette
): MakeCodeColor => nearestPaletteColorFromLab(r, g, b, buildPaletteLab(palette));
