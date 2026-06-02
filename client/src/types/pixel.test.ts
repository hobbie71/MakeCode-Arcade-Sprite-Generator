import { test, expect, describe } from "bun:test";
import {
  MAX_LENGTH,
  MIN_LENGTH,
  STROKE_SIZES,
  BACKGROUND_SIZE,
  TILE_SIZE,
} from "./pixel";

describe("length bounds", () => {
  test("MAX_LENGTH and MIN_LENGTH have the expected values", () => {
    expect(MAX_LENGTH).toBe(512);
    expect(MIN_LENGTH).toBe(1);
  });

  test("MIN_LENGTH is strictly less than MAX_LENGTH", () => {
    expect(MIN_LENGTH).toBeLessThan(MAX_LENGTH);
  });
});

describe("STROKE_SIZES", () => {
  test("offers the three odd brush widths 1, 3, 5", () => {
    expect(STROKE_SIZES).toEqual([1, 3, 5]);
  });

  test("every stroke size is a positive odd integer", () => {
    for (const size of STROKE_SIZES) {
      expect(size).toBeGreaterThan(0);
      expect(size % 2).toBe(1);
    }
  });
});

describe("sprite preset sizes", () => {
  test("BACKGROUND_SIZE matches the MakeCode Arcade screen (160x120)", () => {
    expect(BACKGROUND_SIZE).toEqual({ x: 160, y: 120 });
  });

  test("TILE_SIZE is a 16x16 square", () => {
    expect(TILE_SIZE).toEqual({ x: 16, y: 16 });
    expect(TILE_SIZE.x).toBe(TILE_SIZE.y);
  });
});
