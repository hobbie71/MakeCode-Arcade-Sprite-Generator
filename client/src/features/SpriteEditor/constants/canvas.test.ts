import { test, expect, describe } from "bun:test";
import { PIXEL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "./canvas";

describe("canvas constants", () => {
  test("PIXEL_SIZE is the expected positive integer", () => {
    expect(PIXEL_SIZE).toBe(20);
  });

  test("zoom bounds and step have the expected values", () => {
    expect(MAX_ZOOM).toBe(3);
    expect(MIN_ZOOM).toBe(0.2);
    expect(ZOOM_AMOUNT).toBe(0.2);
  });

  test("MIN_ZOOM is strictly less than MAX_ZOOM", () => {
    expect(MIN_ZOOM).toBeLessThan(MAX_ZOOM);
  });

  test("zoom step is positive and no larger than the zoom range", () => {
    expect(ZOOM_AMOUNT).toBeGreaterThan(0);
    expect(ZOOM_AMOUNT).toBeLessThanOrEqual(MAX_ZOOM - MIN_ZOOM);
  });

  test("all constants are finite numbers", () => {
    for (const value of [PIXEL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT]) {
      expect(typeof value).toBe("number");
      expect(Number.isFinite(value)).toBe(true);
    }
  });
});
