/**
 * Runs the four image→sprite pipeline variants for the /compare harness, so the
 * effect of #2 (downscale-first) and #3 (border detection) can be eyeballed
 * side by side. This composes the REAL production utilities — nothing is
 * re-implemented here — so what the grid shows is what the pipeline would do.
 *
 *                     no border pass        + border detection (#3)
 *   current order      A (how it is now)     B
 *   downscale-first    C (#2)                D (#2 + #3)
 *
 * The outline mask (#3) is derived once from the shared downscaled reference and
 * applied to both A→B and C→D, so B/D isolate exactly the border pass.
 */
import { MakeCodeColor } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";
import { buildPaletteLab } from "../../utils/colors/oklab";
import { createCanvasFromImage } from "../../features/InputSection/utils/imageProcessers";
import {
  removeBackground,
  scaleCanvasToTarget,
} from "../../features/InputSection/utils/canvasProcessing";
import { drawSpriteDataOnCanvasTransparent } from "../../features/SpriteEditor/libs/drawPixelOnCanvas";
import { areaAverageDownscale } from "../../utils/image/areaAverageDownscale";
import {
  quantizeCanvasToSprite,
  quantizeImageDataToSprite,
} from "../../utils/image/quantizeToSprite";
import {
  computeOutlineMask,
  applyOutlineMask,
  darkestPaletteColor,
  type OutlineMaskOptions,
} from "../../utils/image/outlinePreserve";

export interface RunVariantsOptions {
  targetWidth: number;
  targetHeight: number;
  removeBackground?: boolean;
  tolerance?: number;
  maskOptions?: OutlineMaskOptions;
}

export interface Variants {
  /** A — current order: quantize @ full res, then nearest-neighbour downscale. */
  current: MakeCodeColor[][];
  /** B — current order + border detection. */
  currentEdge: MakeCodeColor[][];
  /** C — downscale-first (area-average, linear light), then quantize. */
  downscaleFirst: MakeCodeColor[][];
  /** D — downscale-first + border detection. */
  downscaleFirstEdge: MakeCodeColor[][];
}

const getImageData = (canvas: HTMLCanvasElement): ImageData => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("runVariants: failed to get 2d context");
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export const runVariants = (
  image: HTMLImageElement,
  palette: MakeCodePalette,
  options: RunVariantsOptions
): Variants => {
  const {
    targetWidth,
    targetHeight,
    removeBackground: doRemoveBackground = true,
    tolerance = 60,
    maskOptions,
  } = options;

  const paletteLab = buildPaletteLab(palette);
  const darkColor = darkestPaletteColor(paletteLab);

  // Shared front of the pipeline (identical for every variant).
  let work = createCanvasFromImage(image);
  if (doRemoveBackground) work = removeBackground(work, tolerance);

  // ── A · Current order ────────────────────────────────────────────────────
  // Quantize at full resolution, draw it back to a full-res canvas, then
  // nearest-neighbour downscale — exactly what the production pipeline does.
  const fullSprite = quantizeCanvasToSprite(work, paletteLab);
  const fullCanvas = document.createElement("canvas");
  fullCanvas.width = work.width;
  fullCanvas.height = work.height;
  drawSpriteDataOnCanvasTransparent(
    fullCanvas,
    { x: 0, y: 0 },
    fullSprite,
    palette,
    1
  );
  const nnCanvas = scaleCanvasToTarget(fullCanvas, targetWidth, targetHeight);
  const current = quantizeCanvasToSprite(nnCanvas, paletteLab);

  // ── C · Downscale-first ──────────────────────────────────────────────────
  // Area-average downscale in linear light, THEN quantize the small image.
  const ref = areaAverageDownscale(work, targetWidth, targetHeight);
  const refImage = getImageData(ref);
  const downscaleFirst = quantizeImageDataToSprite(refImage, paletteLab);

  // ── #3 · Border detection ────────────────────────────────────────────────
  // One mask from the shared downscaled reference, applied to both A and C.
  const mask = computeOutlineMask(refImage, maskOptions);
  const currentEdge = applyOutlineMask(current, mask, darkColor);
  const downscaleFirstEdge = applyOutlineMask(downscaleFirst, mask, darkColor);

  return { current, currentEdge, downscaleFirst, downscaleFirstEdge };
};
