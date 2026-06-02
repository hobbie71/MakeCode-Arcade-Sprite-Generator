import { test, expect, describe } from "bun:test";
import { getSelectedSpriteData } from "./getSelectedSpriteData";
import { MakeCodeColor } from "../../../types/color";

const T = MakeCodeColor.TRANSPARENT;
const R = MakeCodeColor.RED;
const B = MakeCodeColor.BLUE;
const G = MakeCodeColor.GREEN;
const Y = MakeCodeColor.YELLOW;

// 4x4 grid:
// (0,0) (1,0) (2,0) (3,0)
const grid = [
  [T, R, B, G],
  [R, B, G, Y],
  [B, G, Y, T],
  [G, Y, T, R],
];

describe("getSelectedSpriteData", () => {
  test("extracts a top-left 2x2 sub-region (end exclusive)", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 0, y: 0 },
      end: { x: 2, y: 2 },
    });
    expect(result).toEqual([
      [T, R],
      [R, B],
    ]);
  });

  test("extracts an interior region", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 1, y: 1 },
      end: { x: 3, y: 3 },
    });
    expect(result).toEqual([
      [B, G],
      [G, Y],
    ]);
  });

  test("extracts a full single row", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 0, y: 2 },
      end: { x: 4, y: 3 },
    });
    expect(result).toEqual([[B, G, Y, T]]);
  });

  test("extracts a full single column", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 3, y: 0 },
      end: { x: 4, y: 4 },
    });
    expect(result).toEqual([[G], [Y], [T], [R]]);
  });

  test("returns an empty selection when start equals end", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 1, y: 1 },
      end: { x: 1, y: 1 },
    });
    expect(result).toEqual([]);
  });

  test("selecting the whole grid returns a copy of every pixel", () => {
    const result = getSelectedSpriteData(grid, {
      start: { x: 0, y: 0 },
      end: { x: 4, y: 4 },
    });
    expect(result).toEqual(grid);
  });
});
