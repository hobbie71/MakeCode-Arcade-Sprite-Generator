import { MAX_ZOOM, FIT_MIN_ZOOM, CANVAS_FIT_PADDING } from "../constants/canvas";

export interface StageFit {
  /** Scale factor for the canvas, clamped to [MIN_ZOOM, MAX_ZOOM]. */
  zoom: number;
  /** Canvas-center position within the stage (the canvas transform centers on this). */
  offset: { x: number; y: number };
}

/**
 * Compute the zoom + center offset that fits a sprite inside the stage while
 * keeping it clear of the floating bottom action bar.
 *
 * The bar occupies a fixed pixel height at the bottom of the stage, so we fit
 * into — and center within — the *usable* region above it (`stageHeight -
 * bottomInset`) rather than the whole stage. Because the reserve is the bar's
 * real measured size (not a percentage of stage height), the canvas clears the
 * bar at every viewport height and aspect ratio, down to the MIN_ZOOM floor.
 *
 * All values are in CSS pixels. `canvasWidth/Height` are the sprite's intrinsic
 * size (sprite cells × PIXEL_SIZE), i.e. the canvas element size before scaling.
 */
export function computeStageFit(
  stageWidth: number,
  stageHeight: number,
  bottomInset: number,
  canvasWidth: number,
  canvasHeight: number
): StageFit {
  const usableHeight = Math.max(0, stageHeight - bottomInset);
  const pad = 1 - CANVAS_FIT_PADDING;

  const availableWidth = stageWidth * pad;
  const availableHeight = usableHeight * pad;

  // Smaller of the two ratios fits the canvas in both dimensions.
  const optimalZoom = Math.min(
    availableWidth / canvasWidth,
    availableHeight / canvasHeight
  );
  // Floor at FIT_MIN_ZOOM (not MIN_ZOOM) so large canvases can shrink enough to
  // fit fully rather than clamping at MIN_ZOOM and overflowing the stage.
  const zoom = Math.max(FIT_MIN_ZOOM, Math.min(MAX_ZOOM, optimalZoom));

  return {
    zoom,
    // Center horizontally in the stage, vertically in the region above the bar.
    offset: { x: stageWidth / 2, y: usableHeight / 2 },
  };
}
