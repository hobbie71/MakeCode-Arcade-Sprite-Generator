/**
 * Pure, context-free quantization of an image to a MakeCode sprite grid.
 *
 * This is the same per-pixel OKLab nearest-colour snap that
 * `useMakeCodeColorConverter` performs, factored out of the React hook so the
 * conversion pipeline (and the /compare harness) can run it on a plain canvas or
 * ImageData without pulling in context. The hook remains the app-facing entry
 * point; this is the reusable core.
 */
import { MakeCodeColor } from "../../types/color";
import { rgbaToMakeCodeColor } from "../colors/oklab";
import type { PaletteLab } from "../colors/oklab";
import { DEFAULT_ALPHA_THRESHOLD } from "../colors/oklab";

/** Snap every pixel of an ImageData to the nearest palette colour. */
export const quantizeImageDataToSprite = (
  image: ImageData,
  paletteLab: PaletteLab[],
  alphaThreshold: number = DEFAULT_ALPHA_THRESHOLD
): MakeCodeColor[][] => {
  const { width, height, data } = image;
  const sprite: MakeCodeColor[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MakeCodeColor[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      row.push(
        rgbaToMakeCodeColor(
          data[i],
          data[i + 1],
          data[i + 2],
          data[i + 3],
          paletteLab,
          alphaThreshold
        )
      );
    }
    sprite.push(row);
  }
  return sprite;
};

/** Snap every pixel of a canvas to the nearest palette colour. */
export const quantizeCanvasToSprite = (
  canvas: HTMLCanvasElement,
  paletteLab: PaletteLab[],
  alphaThreshold: number = DEFAULT_ALPHA_THRESHOLD
): MakeCodeColor[][] => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("quantizeCanvasToSprite: failed to get 2d context");
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return quantizeImageDataToSprite(image, paletteLab, alphaThreshold);
};
