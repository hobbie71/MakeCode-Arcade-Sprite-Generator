import { test, expect, describe } from "bun:test";
import { getOpenAIFinalSize, getPixelLabFinalSize, pythonRound } from "./size";

describe("getOpenAIFinalSize", () => {
  test("square band -> 1024x1024", () => {
    expect(getOpenAIFinalSize({ width: 16, height: 16 })).toBe("1024x1024"); // 1.0
    expect(getOpenAIFinalSize({ width: 11, height: 10 })).toBe("1024x1024"); // 1.1
  });
  test("landscape (ar >= 1.2) -> 1536x1024", () => {
    expect(getOpenAIFinalSize({ width: 24, height: 16 })).toBe("1536x1024"); // 1.5
    expect(getOpenAIFinalSize({ width: 12, height: 10 })).toBe("1536x1024"); // 1.2 exactly
  });
  test("portrait (ar <= 1/1.2) -> 1024x1536", () => {
    expect(getOpenAIFinalSize({ width: 16, height: 24 })).toBe("1024x1536"); // 0.667
    expect(getOpenAIFinalSize({ width: 10, height: 16 })).toBe("1024x1536"); // 0.625
  });
});

describe("getPixelLabFinalSize", () => {
  test("fitFullCanvasSize returns the size unchanged", () => {
    expect(getPixelLabFinalSize({ width: 50, height: 70 }, true)).toEqual({ width: 50, height: 70 });
  });
  test("16x16 -> 128x128 (fixture)", () => {
    expect(getPixelLabFinalSize({ width: 16, height: 16 }, false)).toEqual({ width: 128, height: 128 });
  });
  test("32x16 (ar 2) -> 128x64", () => {
    expect(getPixelLabFinalSize({ width: 32, height: 16 }, false)).toEqual({ width: 128, height: 64 });
  });
  test("16x32 (ar 0.5) -> 64x128", () => {
    expect(getPixelLabFinalSize({ width: 16, height: 32 }, false)).toEqual({ width: 64, height: 128 });
  });
  test("200x200 -> 400x400 (minTarget 400 hits preferred 400)", () => {
    expect(getPixelLabFinalSize({ width: 200, height: 200 }, false)).toEqual({ width: 400, height: 400 });
  });
  test("300x300 -> 400x400 (no preferred >= 600, capped at 400)", () => {
    expect(getPixelLabFinalSize({ width: 300, height: 300 }, false)).toEqual({ width: 400, height: 400 });
  });
});

describe("pythonRound (banker's rounding)", () => {
  test("rounds half to even", () => {
    expect(pythonRound(0.5)).toBe(0);
    expect(pythonRound(1.5)).toBe(2);
    expect(pythonRound(2.5)).toBe(2);
    expect(pythonRound(3.5)).toBe(4);
    expect(pythonRound(128.4)).toBe(128);
    expect(pythonRound(128.6)).toBe(129);
  });
});
