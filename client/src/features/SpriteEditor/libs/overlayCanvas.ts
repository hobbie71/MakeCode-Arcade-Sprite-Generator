/**
 * Shared canvas setup for the stage overlays (GridOverlay, the marching-ants
 * overlay). Each overlay fills its (border/padding-free) container and draws
 * at device resolution; geometry comes from the sprite canvas's measured
 * on-screen box so the overlay tracks zoom/pan/resize exactly.
 */

export interface OverlayFrame {
  ctx: CanvasRenderingContext2D;
  dpr: number;
}

export interface SpriteBox {
  left: number;
  top: number;
  w: number;
  h: number;
}

/**
 * Size the overlay's backing store to cover the visible stage in device
 * pixels (bounded by the viewport, so it stays small even at high zoom on
 * large sprites) and return a cleared 2d context.
 */
const prepareOverlayCanvas = (
  overlay: HTMLCanvasElement,
  parent: HTMLElement
): OverlayFrame | null => {
  const dpr = window.devicePixelRatio || 1;
  const bw = Math.round(parent.clientWidth * dpr);
  const bh = Math.round(parent.clientHeight * dpr);
  if (overlay.width !== bw) overlay.width = bw;
  if (overlay.height !== bh) overlay.height = bh;

  const ctx = overlay.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  return { ctx, dpr };
};

/**
 * The rendered sprite canvas's box expressed in the overlay's device pixels.
 * The overlay fills the container, so the parent's top-left is the overlay's
 * origin. Measured (getBoundingClientRect), never recomputed from offset/zoom
 * — see GridOverlay's docblock for why.
 */
const measureSpriteBox = (
  main: HTMLCanvasElement,
  parent: HTMLElement,
  dpr: number
): SpriteBox => {
  const mr = main.getBoundingClientRect();
  const pr = parent.getBoundingClientRect();
  return {
    left: (mr.left - pr.left) * dpr,
    top: (mr.top - pr.top) * dpr,
    w: mr.width * dpr,
    h: mr.height * dpr,
  };
};

/**
 * Shared prologue for an overlay's draw pass: null-check the mounted
 * elements, size + clear the overlay, and measure the sprite box. Callers
 * keep their own "anything to draw?" early-returns AFTER this call — the
 * overlay must be cleared even when there is nothing to draw.
 */
export const beginOverlayFrame = (
  overlay: HTMLCanvasElement | null,
  main: HTMLCanvasElement | null
): (OverlayFrame & { box: SpriteBox }) | null => {
  const parent = overlay?.parentElement;
  if (!overlay || !parent || !main) return null;

  const frame = prepareOverlayCanvas(overlay, parent);
  if (!frame) return null;
  return { ...frame, box: measureSpriteBox(main, parent, frame.dpr) };
};
