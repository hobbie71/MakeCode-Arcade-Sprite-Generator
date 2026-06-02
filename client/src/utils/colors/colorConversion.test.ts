import { test, expect, describe } from "bun:test";
import {
  hexToRgb,
  hexToRgba,
  rgbToHex,
  rgbaToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  isValidHex,
  normalizeHex,
  getLuminance,
  getContrastRatio,
} from "./colorConversion";

describe("hexToRgb", () => {
  test("parses 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });
  test("expands 3-digit shorthand", () => {
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("fff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  test("drops the alpha channel of an 8-digit hex", () => {
    expect(hexToRgb("#ff000080")).toEqual({ r: 255, g: 0, b: 0 });
  });
  test("throws on garbage", () => {
    expect(() => hexToRgb("nope")).toThrow(/Invalid hex color/);
  });
});

describe("hexToRgba", () => {
  test("defaults alpha to 255 for 6-digit", () => {
    expect(hexToRgba("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  });
  test("reads the alpha byte of an 8-digit hex", () => {
    expect(hexToRgba("#00000080")).toEqual({ r: 0, g: 0, b: 0, a: 128 });
  });
  test("throws on a 5-digit string", () => {
    expect(() => hexToRgba("#12345")).toThrow(/Invalid hex color/);
  });
});

describe("rgbToHex / rgbaToHex", () => {
  test("formats and clamps out-of-range channels", () => {
    expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
    expect(rgbToHex(300, -5, 16)).toBe("#ff0010");
  });
  test("omits alpha when fully opaque, includes it otherwise", () => {
    expect(rgbaToHex(255, 255, 255, 255)).toBe("#ffffff");
    expect(rgbaToHex(0, 0, 0, 128)).toBe("#00000080");
  });
});

describe("HSL round trip", () => {
  test("primary red converts and back", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });
  test("greys have zero saturation", () => {
    expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
  });
  test("hslToRgb normalizes a negative/over-360 hue", () => {
    expect(hslToRgb(360, 100, 50)).toEqual(hslToRgb(0, 100, 50));
    expect(hslToRgb(-120, 100, 50)).toEqual(hslToRgb(240, 100, 50));
  });
});

describe("HSV round trip", () => {
  test("primary blue", () => {
    expect(rgbToHsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 });
    expect(hsvToRgb(240, 100, 100)).toEqual({ r: 0, g: 0, b: 255 });
  });
  test("black has zero saturation and value", () => {
    expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
  });
});

describe("CMYK", () => {
  test("white and black extremes", () => {
    expect(rgbToCmyk(255, 255, 255)).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    expect(rgbToCmyk(0, 0, 0)).toEqual({ c: 0, m: 0, y: 0, k: 100 });
  });
  test("cmykToRgb inverts pure colors", () => {
    expect(cmykToRgb(0, 100, 100, 0)).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("isValidHex / normalizeHex", () => {
  test("isValidHex accepts 3/6/8-digit, rejects junk", () => {
    expect(isValidHex("#fff")).toBe(true);
    expect(isValidHex("ff00ff")).toBe(true);
    expect(isValidHex("#ff00ff80")).toBe(true);
    expect(isValidHex("#ggg")).toBe(false);
    expect(isValidHex("#12345")).toBe(false);
  });
  test("normalizeHex lowercases and prefixes '#'", () => {
    expect(normalizeHex("FFF")).toBe("#ffffff");
    expect(normalizeHex("#AABBCC")).toBe("#aabbcc");
    expect(() => normalizeHex("xyz")).toThrow(/Invalid hex color/);
  });
});

describe("luminance & contrast", () => {
  test("white is brighter than black", () => {
    expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 5);
    expect(getLuminance(0, 0, 0)).toBe(0);
  });
  test("black-on-white contrast is the WCAG maximum 21:1", () => {
    const ratio = getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(ratio).toBeCloseTo(21, 1);
  });
});
