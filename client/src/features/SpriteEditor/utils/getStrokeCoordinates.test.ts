import { test, expect, describe } from "bun:test";
import { getStrokeCoordinates } from "./getStrokeCoordinates";

const sortCoords = (c: { x: number; y: number }[]) =>
  [...c].sort((a, b) => a.y - b.y || a.x - b.x);

describe("getStrokeCoordinates", () => {
  test("size 1 returns only the center pixel", () => {
    expect(getStrokeCoordinates({ x: 5, y: 7 }, 1)).toEqual([{ x: 5, y: 7 }]);
  });

  test("size 3 returns a 3x3 block (9 pixels) centered on the point", () => {
    const result = getStrokeCoordinates({ x: 0, y: 0 }, 3);
    expect(result.length).toBe(9);
    expect(sortCoords(result)).toEqual(
      sortCoords([
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ])
    );
  });

  test("size 5 returns a 5x5 block (25 pixels)", () => {
    const result = getStrokeCoordinates({ x: 10, y: 10 }, 5);
    expect(result.length).toBe(25);
    // radius is 2, so spans 8..12 on both axes
    const xs = result.map((c) => c.x);
    const ys = result.map((c) => c.y);
    expect(Math.min(...xs)).toBe(8);
    expect(Math.max(...xs)).toBe(12);
    expect(Math.min(...ys)).toBe(8);
    expect(Math.max(...ys)).toBe(12);
  });

  test("always includes the center coordinate", () => {
    const result = getStrokeCoordinates({ x: 3, y: 4 }, 5);
    expect(result).toContainEqual({ x: 3, y: 4 });
  });

  test("offsets relative to a non-origin center", () => {
    const result = getStrokeCoordinates({ x: 2, y: 2 }, 3);
    expect(sortCoords(result)).toEqual(
      sortCoords([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
      ])
    );
  });
});
