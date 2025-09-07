import { type Coordinates } from "../../../types/pixel";

export const getLineCoordinates = (
  start: Coordinates,
  end: Coordinates
): Coordinates[] => {
  const coordinates: Coordinates[] = [];
  let { x: x0, y: y0 } = start;
  const { x: x1, y: y1 } = end;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    coordinates.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return coordinates;
};

export const getSquareCoordinates = (
  start: Coordinates,
  end: Coordinates
): Coordinates[] => {
  const coordinates: Coordinates[] = [];

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  // Top edge
  coordinates.push(
    ...getLineCoordinates({ x: minX, y: minY }, { x: maxX, y: minY })
  );
  // Right edge
  coordinates.push(
    ...getLineCoordinates({ x: maxX, y: minY }, { x: maxX, y: maxY })
  );
  // Bottom edge
  coordinates.push(
    ...getLineCoordinates({ x: maxX, y: maxY }, { x: minX, y: maxY })
  );
  // Left edge
  coordinates.push(
    ...getLineCoordinates({ x: minX, y: maxY }, { x: minX, y: minY })
  );

  // Remove duplicate coordinates
  const uniqueCoordinates = Array.from(
    new Map(coordinates.map((c) => [`${c.x},${c.y}`, c])).values()
  );

  return uniqueCoordinates;
};

export const getCircleCoordinates = (
  start: Coordinates,
  end: Coordinates
): Coordinates[] => {
  const coordinates: Coordinates[] = [];

  // Calculate center and radius
  const centerX = start.x;
  const centerY = start.y;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const radius = Math.round(Math.sqrt(dx * dx + dy * dy));

  let x = 0;
  let y = radius;
  let d = 3 - 2 * radius;

  const plotCirclePoints = (cx: number, cy: number, x: number, y: number) => {
    coordinates.push({ x: cx + x, y: cy + y });
    coordinates.push({ x: cx - x, y: cy + y });
    coordinates.push({ x: cx + x, y: cy - y });
    coordinates.push({ x: cx - x, y: cy - y });
    coordinates.push({ x: cx + y, y: cy + x });
    coordinates.push({ x: cx - y, y: cy + x });
    coordinates.push({ x: cx + y, y: cy - x });
    coordinates.push({ x: cx - y, y: cy - x });
  };

  while (y >= x) {
    plotCirclePoints(centerX, centerY, x, y);
    x++;
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else {
      d = d + 4 * x + 6;
    }
  }

  // Remove duplicate coordinates
  const uniqueCoordinates = Array.from(
    new Map(coordinates.map((c) => [`${c.x},${c.y}`, c])).values()
  );

  return uniqueCoordinates;
};
