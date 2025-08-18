import { Coordinates } from "@/types/pixel";

export function getCanvasCoordinates(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent,
  pixelSize: number,
  zoom: number
): Coordinates {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / zoom;
  const y = (e.clientY - rect.top) / zoom;

  const coordinates: Coordinates = {
    x: Math.floor(x / pixelSize),
    y: Math.floor(y / pixelSize),
  };

  return coordinates;
}
