/**
 * sRGB ⇄ linear-light conversion.
 *
 * sRGB byte values (0–255) are *gamma-encoded* — averaging them directly (as a
 * naive canvas downscale does) shifts colours lighter and muddier. Correct
 * blending (area-averaging during downscale, and the first step of the OKLab
 * transform) must happen in *linear* light: decode → operate → re-encode.
 */

/** Decode one gamma-encoded sRGB byte (0–255) to a linear-light value (0–1). */
export const srgbToLinear = (c8: number): number => {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

/** Encode a linear-light value (0–1) back to a gamma-encoded sRGB byte (0–255). */
export const linearToSrgb = (lin: number): number => {
  const clamped = lin <= 0 ? 0 : lin >= 1 ? 1 : lin;
  const encoded =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return encoded * 255;
};
