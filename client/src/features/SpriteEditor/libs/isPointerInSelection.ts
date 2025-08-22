import { Coordinates, SelectionArea } from "@/types/pixel";

export const isPointerInSelection = (
  pointer: Coordinates,
  area: SelectionArea | null
): boolean => {
  if (!area) return false;

  const minX = Math.min(area.start.x, area.end.x);
  const maxX = Math.max(area.start.x, area.end.x);
  const minY = Math.min(area.start.y, area.end.y);
  const maxY = Math.max(area.start.y, area.end.y);

  return (
    pointer.x >= minX &&
    pointer.x <= maxX &&
    pointer.y >= minY &&
    pointer.y <= maxY
  );
};
