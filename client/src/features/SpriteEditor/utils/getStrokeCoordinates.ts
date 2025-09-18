import type { Coordinates, StrokeSize } from "../../../types/pixel";

/**
 * Get all pixel coordinates that should be affected by a stroke of given size
 * @param center - The center position of the stroke
 * @param strokeSize - The size of the stroke (1, 3, or 5)
 * @returns Array of coordinates that should be painted
 */
export const getStrokeCoordinates = (
  center: Coordinates,
  strokeSize: StrokeSize
): Coordinates[] => {
  const coordinates: Coordinates[] = [];
  const radius = Math.floor(strokeSize / 2);

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      coordinates.push({
        x: center.x + dx,
        y: center.y + dy,
      });
    }
  }

  return coordinates;
};
