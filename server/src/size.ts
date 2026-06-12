import type { Size } from "@makespritecode/shared";

// gpt-image-2 accepts arbitrary resolutions and bills by output tokens that scale
// with image area, so we always request the SMALLEST resolution the API allows for
// the sprite's aspect ratio. The generated image is downscaled to a tiny sprite on
// the client, so any pixels above the floor are pure wasted spend.
//
// gpt-image-2 constraints:
//   - total pixels between 655,360 and 8,294,400
//   - each edge a multiple of 16px (max 3840)
//   - long:short edge ratio at most 3:1
//
// We sit right at the 655,360-pixel floor — the cheapest valid request — which also
// fixes the old behaviour of bucketing every sprite into one of three fixed sizes
// whose aspect ratio rarely matched the sprite.

const MIN_PIXELS = 655_360;
const EDGE_STEP = 16;
const MAX_EDGE_RATIO = 3;

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n));
const ceilTo = (n: number, step: number): number => Math.ceil(n / step) * step;

/** Smallest gpt-image-2 resolution (a "WxH" string) matching the sprite's aspect
 *  ratio, clamped to the API's 3:1 limit and rounded up to the 655,360-pixel floor. */
export function getOpenAIFinalSize(size: Size): `${number}x${number}` {
  const ratio = clamp(size.width / size.height, 1 / MAX_EDGE_RATIO, MAX_EDGE_RATIO);
  // From area = h * (ratio * h) = MIN_PIXELS  ->  h = sqrt(MIN_PIXELS / ratio).
  // Round each edge UP to a multiple of 16 so the product stays at/above the floor.
  const height = ceilTo(Math.sqrt(MIN_PIXELS / ratio), EDGE_STEP);
  const width = ceilTo(height * ratio, EDGE_STEP);
  return `${width}x${height}`;
}

export function openAIFinalSizeToDims(size: `${number}x${number}`): Size {
  const [w, h] = size.split("x");
  return { width: Number(w), height: Number(h) };
}
