import { describe, expect, test } from "bun:test";

import {
  computeContainPlacement,
  containFrame,
  fullFrame,
  letterboxFrame,
  subFrame,
} from "./sourceFrame";

describe("computeContainPlacement", () => {
  test("wide source into square target is centered vertically", () => {
    expect(computeContainPlacement(800, 600, 16, 16)).toEqual({
      x: 0,
      y: 2,
      width: 16,
      height: 12,
    });
  });

  test("tall source into wide target is centered horizontally", () => {
    expect(computeContainPlacement(600, 800, 160, 120)).toEqual({
      x: 35,
      y: 0,
      width: 90,
      height: 120,
    });
  });

  test("matching aspect fills the target", () => {
    expect(computeContainPlacement(1024, 1024, 64, 64)).toEqual({
      x: 0,
      y: 0,
      width: 64,
      height: 64,
    });
  });
});

describe("subFrame", () => {
  test("a crop on the source canvas maps 1:1 onto a full frame", () => {
    const frame = fullFrame(800, 600);
    expect(
      subFrame(frame, 800, 600, { x: 100, y: 50, width: 400, height: 300 })
    ).toEqual({ x: 100, y: 50, width: 400, height: 300 });
  });

  test("scales when the canvas is smaller than the frame it represents", () => {
    const frame = { x: 100, y: 50, width: 400, height: 300 };
    expect(
      subFrame(frame, 16, 12, { x: 4, y: 3, width: 8, height: 6 })
    ).toEqual({ x: 200, y: 125, width: 200, height: 150 });
  });
});

describe("letterboxFrame", () => {
  test("no-crop wide source into a square canvas extends past the image", () => {
    const frame = fullFrame(800, 600);
    const placement = computeContainPlacement(800, 600, 16, 16);
    const result = letterboxFrame(frame, 800, 600, 16, 16, placement);
    expect(result.x).toBe(0);
    expect(result.width).toBe(800);
    expect(result.height).toBe(800);
    expect(result.y).toBe(-100);
  });

  test("matching aspect leaves the frame untouched", () => {
    const frame = { x: 10, y: 20, width: 64, height: 64 };
    expect(
      letterboxFrame(frame, 64, 64, 16, 16, {
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      })
    ).toEqual(frame);
  });

  test("fill crop then scale keeps the crop rect", () => {
    // Fill already produced a target-size canvas, so the placement is the
    // full target and the frame stays the crop rect.
    const cropped = subFrame(fullFrame(800, 600), 800, 600, {
      x: 100,
      y: 0,
      width: 600,
      height: 600,
    });
    expect(
      letterboxFrame(cropped, 16, 16, 16, 16, {
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      })
    ).toEqual({ x: 100, y: 0, width: 600, height: 600 });
  });
});

describe("containFrame", () => {
  test("equals the no-crop pipeline geometry", () => {
    expect(containFrame(800, 600, 16, 16)).toEqual({
      x: 0,
      y: -100,
      width: 800,
      height: 800,
    });
  });
});
