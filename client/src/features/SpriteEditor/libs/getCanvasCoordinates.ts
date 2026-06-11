import type { Coordinates } from "../../../types/pixel";
import { PIXEL_SIZE } from "../constants/canvas";

export function getCanvasCoordinates(
  canvas: HTMLCanvasElement,
  // Structural type so both React synthetic events and native window
  // MouseEvents (select-tool gestures use window listeners) are accepted.
  e: { clientX: number; clientY: number },
  zoom: number,
  pixelSize: number = PIXEL_SIZE
): Coordinates {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / (pixelSize * zoom));
  const y = Math.floor((e.clientY - rect.top) / (pixelSize * zoom));
  return { x, y };
}

/**
 * Un-floored sprite-pixel coordinates (== grid coordinates, where integers
 * fall on cell boundaries). The select tool needs these for screen-space
 * handle hit-testing and resize math, where the floored version would snap
 * away the sub-pixel precision the hit radius depends on.
 */
export function getCanvasPointFloat(
  canvas: HTMLCanvasElement,
  e: { clientX: number; clientY: number },
  zoom: number,
  pixelSize: number = PIXEL_SIZE
): Coordinates {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / (pixelSize * zoom),
    y: (e.clientY - rect.top) / (pixelSize * zoom),
  };
}
