import { describe, expect, test } from "bun:test";

import { drawSourceFrame } from "./drawSourceFrame";

type DrawArgs = number[];

const fakeContext = () => {
  const calls: { clear: DrawArgs[]; draw: DrawArgs[] } = { clear: [], draw: [] };
  const ctx = {
    clearRect: (...args: DrawArgs) => calls.clear.push(args),
    drawImage: (_img: unknown, ...args: DrawArgs) => calls.draw.push(args),
  } as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
};

const image = { width: 800, height: 600 } as unknown as ImageBitmap;

describe("drawSourceFrame", () => {
  test("a frame inside the image maps straight onto the destination", () => {
    const { ctx, calls } = fakeContext();
    drawSourceFrame(ctx, image, { x: 100, y: 0, width: 600, height: 600 }, 60, 60);
    expect(calls.clear).toEqual([[0, 0, 60, 60]]);
    expect(calls.draw).toEqual([[100, 0, 600, 600, 0, 0, 60, 60]]);
  });

  test("a letterboxed frame leaves the out-of-image bands blank", () => {
    const { ctx, calls } = fakeContext();
    // The no-crop frame for 800x600 into a square: 800x800 starting at y=-100.
    drawSourceFrame(ctx, image, { x: 0, y: -100, width: 800, height: 800 }, 80, 80);
    expect(calls.draw).toEqual([[0, 0, 800, 600, 0, 10, 80, 60]]);
  });

  test("a frame fully outside the image draws nothing", () => {
    const { ctx, calls } = fakeContext();
    drawSourceFrame(ctx, image, { x: 900, y: 0, width: 100, height: 100 }, 10, 10);
    expect(calls.clear).toHaveLength(1);
    expect(calls.draw).toEqual([]);
  });
});
