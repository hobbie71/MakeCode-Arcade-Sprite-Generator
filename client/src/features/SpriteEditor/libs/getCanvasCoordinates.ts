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
