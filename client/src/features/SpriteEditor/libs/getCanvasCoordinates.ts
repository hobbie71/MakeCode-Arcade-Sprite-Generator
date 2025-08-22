import { Coordinates } from "@/types/pixel";
import { PIXEL_SIZE } from "../constants/pixelSize";

export function getCanvasCoordinates(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent,
  zoom: number,
  pixelSize: number = PIXEL_SIZE
): Coordinates {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / (pixelSize * zoom));
  const y = Math.floor((e.clientY - rect.top) / (pixelSize * zoom));
  return { x, y };
}
