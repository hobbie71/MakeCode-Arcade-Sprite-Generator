export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * The region of the ORIGINAL source image (in its own pixel coordinates) that
 * maps onto the sprite's full canvas. It can extend past the image edges when
 * the pipeline letterboxed the source, so the empty bands line up too. Lets the
 * Source panel crop the full-res original to the sprite's framing without
 * re-running the (expensive) processing pipeline.
 */
export type SourceFrame = Rect;

export const fullFrame = (width: number, height: number): SourceFrame => ({
  x: 0,
  y: 0,
  width,
  height,
});

/**
 * Narrows `frame` to the sub-rectangle `rect`, where `rect` is expressed in the
 * coordinates of a canvas of `canvasWidth × canvasHeight` that currently
 * represents the whole of `frame`.
 */
export const subFrame = (
  frame: SourceFrame,
  canvasWidth: number,
  canvasHeight: number,
  rect: Rect
): SourceFrame => {
  const sx = frame.width / canvasWidth;
  const sy = frame.height / canvasHeight;
  return {
    x: frame.x + rect.x * sx,
    y: frame.y + rect.y * sy,
    width: rect.width * sx,
    height: rect.height * sy,
  };
};

/** Where a `sourceWidth × sourceHeight` image lands when contained (aspect
 *  preserved, centered) inside a `targetWidth × targetHeight` box. */
export const computeContainPlacement = (
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): Rect => {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  let width: number;
  let height: number;
  if (sourceAspect > targetAspect) {
    width = targetWidth;
    height = Math.round(targetWidth / sourceAspect);
  } else {
    height = targetHeight;
    width = Math.round(targetHeight * sourceAspect);
  }
  return {
    x: Math.floor((targetWidth - width) / 2),
    y: Math.floor((targetHeight - height) / 2),
    width,
    height,
  };
};

/**
 * Widens `frame` so it covers the whole target box after the canvas (which
 * represents `frame`) is contained inside it at `placement`. The bands outside
 * the placement become out-of-image area in the returned frame.
 */
export const letterboxFrame = (
  frame: SourceFrame,
  canvasWidth: number,
  canvasHeight: number,
  targetWidth: number,
  targetHeight: number,
  placement: Rect
): SourceFrame => {
  const perX = canvasWidth / placement.width;
  const perY = canvasHeight / placement.height;
  return subFrame(frame, canvasWidth, canvasHeight, {
    x: -placement.x * perX,
    y: -placement.y * perY,
    width: targetWidth * perX,
    height: targetHeight * perY,
  });
};

/** The frame the pipeline produces with no crop: the whole image contained in
 *  the target box. Used when a source exists but hasn't been processed yet. */
export const containFrame = (
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): SourceFrame =>
  letterboxFrame(
    fullFrame(sourceWidth, sourceHeight),
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
    computeContainPlacement(sourceWidth, sourceHeight, targetWidth, targetHeight)
  );
