import { test, expect, describe } from "bun:test";
import {
  getLineCoordinates,
  getSquareCoordinates,
  getCircleCoordinates,
} from "./getShapeCoordinates";

type C = { x: number; y: number };

const sortCoords = (c: C[]) => [...c].sort((a, b) => a.y - b.y || a.x - b.x);
const key = (c: C) => `${c.x},${c.y}`;
const hasNoDuplicates = (c: C[]) => new Set(c.map(key)).size === c.length;

describe("getLineCoordinates", () => {
  test("single point when start equals end", () => {
    expect(getLineCoordinates({ x: 3, y: 3 }, { x: 3, y: 3 })).toEqual([
      { x: 3, y: 3 },
    ]);
  });

  test("horizontal line is contiguous and inclusive of both ends", () => {
    expect(getLineCoordinates({ x: 0, y: 0 }, { x: 3, y: 0 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);
  });

  test("vertical line", () => {
    expect(getLineCoordinates({ x: 2, y: 0 }, { x: 2, y: 2 })).toEqual([
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ]);
  });

  test("perfect diagonal advances both axes each step", () => {
    expect(getLineCoordinates({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ]);
  });

  test("draws right-to-left (descending x) correctly", () => {
    expect(getLineCoordinates({ x: 3, y: 0 }, { x: 0, y: 0 })).toEqual([
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]);
  });

  test("a shallow line spans the full horizontal extent with no gaps in x", () => {
    const line = getLineCoordinates({ x: 0, y: 0 }, { x: 5, y: 2 });
    expect(line[0]).toEqual({ x: 0, y: 0 });
    expect(line[line.length - 1]).toEqual({ x: 5, y: 2 });
    const xs = line.map((c) => c.x);
    expect(xs).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe("getSquareCoordinates", () => {
  test("traces the perimeter of a 3x3 box and excludes the interior", () => {
    const result = getSquareCoordinates({ x: 0, y: 0 }, { x: 2, y: 2 });
    expect(hasNoDuplicates(result)).toBe(true);
    // perimeter of a 3x3 square = 8 cells (interior (1,1) excluded)
    expect(result.length).toBe(8);
    expect(result.map(key)).not.toContain("1,1");
    expect(sortCoords(result)).toEqual(
      sortCoords([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 2, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ])
    );
  });

  test("normalizes a reversed rectangle to the same perimeter", () => {
    const a = getSquareCoordinates({ x: 0, y: 0 }, { x: 2, y: 2 });
    const b = getSquareCoordinates({ x: 2, y: 2 }, { x: 0, y: 0 });
    expect(sortCoords(b)).toEqual(sortCoords(a));
  });

  test("a 1x1 square collapses to a single coordinate", () => {
    const result = getSquareCoordinates({ x: 4, y: 4 }, { x: 4, y: 4 });
    expect(result).toEqual([{ x: 4, y: 4 }]);
  });

  test("includes all four corners of a larger box", () => {
    const result = getSquareCoordinates({ x: 1, y: 1 }, { x: 5, y: 4 });
    const keys = result.map(key);
    expect(keys).toContain("1,1");
    expect(keys).toContain("5,1");
    expect(keys).toContain("1,4");
    expect(keys).toContain("5,4");
    expect(hasNoDuplicates(result)).toBe(true);
  });
});

describe("getCircleCoordinates", () => {
  test("radius 0 (start equals end) returns just the center", () => {
    expect(getCircleCoordinates({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual([
      { x: 5, y: 5 },
    ]);
  });

  test("produces a symmetric set of points with no duplicates", () => {
    const center = { x: 10, y: 10 };
    const result = getCircleCoordinates(center, { x: 14, y: 10 });
    expect(hasNoDuplicates(result)).toBe(true);
    expect(result.length).toBeGreaterThan(1);
    // For every plotted point, its horizontal mirror across the center exists.
    const keys = new Set(result.map(key));
    for (const c of result) {
      const mirrored = { x: 2 * center.x - c.x, y: c.y };
      expect(keys.has(key(mirrored))).toBe(true);
    }
  });

  test("all points lie roughly on the requested radius", () => {
    const center = { x: 0, y: 0 };
    const end = { x: 5, y: 0 };
    const radius = 5;
    const result = getCircleCoordinates(center, end);
    for (const c of result) {
      const dist = Math.sqrt(c.x * c.x + c.y * c.y);
      // midpoint-circle points stay within ~1px of the ideal radius
      expect(Math.abs(dist - radius)).toBeLessThanOrEqual(1.5);
    }
  });

  test("rounds the radius from a diagonal end point", () => {
    // dx=3, dy=4 -> radius = round(sqrt(25)) = 5
    const result = getCircleCoordinates({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(result.length).toBeGreaterThan(1);
    // The cardinal extreme at (0, radius) should be present.
    expect(result.map(key)).toContain("0,5");
  });
});
