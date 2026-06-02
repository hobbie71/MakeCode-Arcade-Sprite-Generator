import { test, expect, describe } from "bun:test";
import {
  getPixel,
  getImageDataFromCanvas,
  getRgbaDataFromCanvas,
  getHslaDataFromCanvas,
} from "./getDataFromCanvas";

// happy-dom does not implement a real canvas 2D context, so every canvas here
// is a fake object whose getContext returns a stub with a known getImageData.
const makeFakeCanvas = (
  width: number,
  height: number,
  data: Uint8ClampedArray
): HTMLCanvasElement => {
  const ctx = {
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data,
      width: w,
      height: h,
    }),
  };
  return {
    width,
    height,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
};

describe("getPixel", () => {
  // A 2x2 image: top-left red, top-right semi green, bottom-left blue, bottom-right transparent white.
  const data = new Uint8ClampedArray([
    255, 0, 0, 255, // (0,0)
    0, 255, 0, 128, // (1,0)
    0, 0, 255, 255, // (0,1)
    255, 255, 255, 0, // (1,1)
  ]);

  test("reads the pixel at the origin", () => {
    expect(getPixel(data, 2, 0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 });
  });

  test("indexes by (y * width + x) * 4", () => {
    expect(getPixel(data, 2, 1, 0)).toEqual({ r: 0, g: 255, b: 0, a: 128 });
    expect(getPixel(data, 2, 0, 1)).toEqual({ r: 0, g: 0, b: 255, a: 255 });
    expect(getPixel(data, 2, 1, 1)).toEqual({ r: 255, g: 255, b: 255, a: 0 });
  });

  test("returns undefined channels when reading out of bounds", () => {
    const px = getPixel(data, 2, 5, 5);
    expect(px.r).toBeUndefined();
    expect(px.a).toBeUndefined();
  });
});

describe("getImageDataFromCanvas", () => {
  test("returns the ImageData from the 2d context", () => {
    const data = new Uint8ClampedArray([1, 2, 3, 4]);
    const canvas = makeFakeCanvas(1, 1, data);
    const imageData = getImageDataFromCanvas(canvas);
    expect(imageData.width).toBe(1);
    expect(imageData.height).toBe(1);
    expect(Array.from(imageData.data)).toEqual([1, 2, 3, 4]);
  });

  test("throws when getContext returns null", () => {
    const canvas = {
      width: 2,
      height: 2,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() => getImageDataFromCanvas(canvas)).toThrow(
      /Failed to get Image Data/
    );
  });
});

describe("getRgbaDataFromCanvas", () => {
  test("reshapes flat image data into rows of RGBA objects", () => {
    const data = new Uint8ClampedArray([
      255, 0, 0, 255,
      0, 255, 0, 128,
      0, 0, 255, 255,
      255, 255, 255, 0,
    ]);
    const canvas = makeFakeCanvas(2, 2, data);
    const rgba = getRgbaDataFromCanvas(canvas);

    expect(rgba.length).toBe(2); // two rows
    expect(rgba[0].length).toBe(2); // two columns per row
    expect(rgba[0][0]).toEqual({ r: 255, g: 0, b: 0, a: 255 });
    expect(rgba[0][1]).toEqual({ r: 0, g: 255, b: 0, a: 128 });
    expect(rgba[1][0]).toEqual({ r: 0, g: 0, b: 255, a: 255 });
    expect(rgba[1][1]).toEqual({ r: 255, g: 255, b: 255, a: 0 });
  });

  test("handles a single-row canvas", () => {
    const data = new Uint8ClampedArray([10, 20, 30, 40, 50, 60, 70, 80]);
    const canvas = makeFakeCanvas(2, 1, data);
    const rgba = getRgbaDataFromCanvas(canvas);
    expect(rgba.length).toBe(1);
    expect(rgba[0]).toEqual([
      { r: 10, g: 20, b: 30, a: 40 },
      { r: 50, g: 60, b: 70, a: 80 },
    ]);
  });

  test("propagates the throw when context is null", () => {
    const canvas = {
      width: 1,
      height: 1,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() => getRgbaDataFromCanvas(canvas)).toThrow(
      /Failed to get Image Data/
    );
  });
});

describe("getHslaDataFromCanvas", () => {
  test("converts each RGBA pixel to HSLA, scaling alpha to 0..1", () => {
    const data = new Uint8ClampedArray([
      255, 0, 0, 255, // pure red, opaque
      0, 255, 0, 128, // pure green, half alpha
      0, 0, 255, 255, // pure blue, opaque
      255, 255, 255, 0, // white, transparent
    ]);
    const canvas = makeFakeCanvas(2, 2, data);
    const hsla = getHslaDataFromCanvas(canvas);

    expect(hsla[0][0]).toEqual({ h: 0, s: 100, l: 50, a: 1 });
    expect(hsla[0][1].h).toBe(120);
    expect(hsla[0][1].a).toBeCloseTo(128 / 255, 5);
    expect(hsla[1][0]).toEqual({ h: 240, s: 100, l: 50, a: 1 });
    expect(hsla[1][1]).toEqual({ h: 0, s: 0, l: 100, a: 0 });
  });
});
