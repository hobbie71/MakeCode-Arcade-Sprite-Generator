import type { SourceFrame } from "../../InputSection/utils/sourceFrame";

/**
 * Draws the part of `image` inside `frame` scaled to fill a `destWidth ×
 * destHeight` box at the origin. Frame area outside the image stays blank, so
 * a letterboxed frame draws its bands as empty space. The source rect is
 * clipped by hand: browsers disagree on out-of-bounds drawImage source rects.
 */
export const drawSourceFrame = (
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  frame: SourceFrame,
  destWidth: number,
  destHeight: number
): void => {
  ctx.clearRect(0, 0, destWidth, destHeight);

  const sx = Math.max(0, frame.x);
  const sy = Math.max(0, frame.y);
  const sw = Math.min(image.width, frame.x + frame.width) - sx;
  const sh = Math.min(image.height, frame.y + frame.height) - sy;
  if (sw <= 0 || sh <= 0) return;

  const scaleX = destWidth / frame.width;
  const scaleY = destHeight / frame.height;
  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    (sx - frame.x) * scaleX,
    (sy - frame.y) * scaleY,
    sw * scaleX,
    sh * scaleY
  );
};
