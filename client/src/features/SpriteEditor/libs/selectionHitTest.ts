import type { Coordinates } from "../../../types/pixel";
import type { MaskBounds } from "./selectionMask";
import { PIXEL_SIZE } from "../constants/canvas";

/** The 8 resize handles: 4 corners + 4 edge midpoints. */
export type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export const HANDLE_IDS: HandleId[] = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
];

/** Screen-space grab radius for a handle (CSS px). */
const HANDLE_HIT_CSS_PX = 9;

/** Rect in grid coords: outer boundary spans [x, x+w] × [y, y+h]. */
export interface GridRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const boundsToRect = (b: MaskBounds): GridRect => ({
  x: b.minX,
  y: b.minY,
  w: b.maxX - b.minX + 1,
  h: b.maxY - b.minY + 1,
});

/** Handle anchor points on the rect's outer boundary, in grid coords. */
export const handlePosition = (rect: GridRect, id: HandleId): Coordinates => {
  const { x, y, w, h } = rect;
  const midX = x + w / 2;
  const midY = y + h / 2;
  switch (id) {
    case "nw":
      return { x, y };
    case "n":
      return { x: midX, y };
    case "ne":
      return { x: x + w, y };
    case "e":
      return { x: x + w, y: midY };
    case "se":
      return { x: x + w, y: y + h };
    case "s":
      return { x: midX, y: y + h };
    case "sw":
      return { x, y: y + h };
    case "w":
      return { x, y: midY };
  }
};

/**
 * Which handle (if any) the fractional grid-space point grabs. The threshold
 * is screen-constant — converted from CSS px to grid units via zoom — so
 * handles stay equally grabbable at any zoom.
 */
export const hitTestHandle = (
  point: Coordinates,
  rect: GridRect,
  zoom: number,
  pixelSize: number = PIXEL_SIZE
): HandleId | null => {
  const threshold = HANDLE_HIT_CSS_PX / (pixelSize * zoom);
  let best: HandleId | null = null;
  let bestDist = threshold;
  for (const id of HANDLE_IDS) {
    const pos = handlePosition(rect, id);
    const d = Math.hypot(point.x - pos.x, point.y - pos.y);
    if (d <= bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
};

/** CSS cursor for each handle (directional resize arrows). */
export const handleCursor = (id: HandleId): string => {
  switch (id) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
  }
};

/** -1 grabs the low edge, +1 the high edge, 0 leaves that axis fixed. */
const grabSideX = (id: HandleId): number =>
  id === "nw" || id === "w" || id === "sw"
    ? -1
    : id === "ne" || id === "e" || id === "se"
      ? 1
      : 0;

const grabSideY = (id: HandleId): number =>
  id === "nw" || id === "n" || id === "ne"
    ? -1
    : id === "sw" || id === "s" || id === "se"
      ? 1
      : 0;

export interface ResizeResult {
  rect: GridRect;
  flipX: boolean;
  flipY: boolean;
}

/**
 * New floating rect from a handle drag. The opposite edge stays anchored; the
 * grabbed edge(s) follow the pointer (snapped to integer grid lines). Dragging
 * a grabbed edge past its anchor flips that axis (signed-rect model, Aseprite)
 * — flip flags compose (XOR) with the float's flips at grab time. Shift on a
 * corner locks the aspect ratio to the original.
 */
export const computeResizeRect = (
  startRect: GridRect,
  handle: HandleId,
  pointer: Coordinates,
  startFlipX: boolean,
  startFlipY: boolean,
  lockAspect: boolean,
  canvasW: number,
  canvasH: number
): ResizeResult => {
  const sx = grabSideX(handle);
  const sy = grabSideY(handle);

  // Anchored grid lines (the edges that DON'T move).
  const anchorX = sx === 1 ? startRect.x : startRect.x + startRect.w;
  const anchorY = sy === 1 ? startRect.y : startRect.y + startRect.h;

  let left: number;
  let width: number;
  let flipX = startFlipX;
  if (sx === 0) {
    left = startRect.x;
    width = startRect.w;
  } else {
    const movedX = Math.max(0, Math.min(canvasW, Math.round(pointer.x)));
    let signed = movedX - anchorX;
    if (signed === 0) signed = sx; // keep ≥1 in the grab direction
    // Edge flipped if it crossed to the opposite side of its anchor.
    flipX = startFlipX !== (signed * sx < 0);
    left = Math.min(anchorX, movedX);
    width = Math.max(1, Math.abs(signed));
  }

  let top: number;
  let height: number;
  let flipY = startFlipY;
  if (sy === 0) {
    top = startRect.y;
    height = startRect.h;
  } else {
    const movedY = Math.max(0, Math.min(canvasH, Math.round(pointer.y)));
    let signed = movedY - anchorY;
    if (signed === 0) signed = sy;
    flipY = startFlipY !== (signed * sy < 0);
    top = Math.min(anchorY, movedY);
    height = Math.max(1, Math.abs(signed));
  }

  // Aspect lock only makes sense when both axes move (a corner handle).
  if (lockAspect && sx !== 0 && sy !== 0 && startRect.h !== 0) {
    const aspect = startRect.w / startRect.h;
    // Drive height from width, then re-extend from the anchor corner.
    height = Math.max(1, Math.round(width / aspect));
    top = sy === 1 ? anchorY : anchorY - height;
  }

  return { rect: { x: left, y: top, w: width, h: height }, flipX, flipY };
};
