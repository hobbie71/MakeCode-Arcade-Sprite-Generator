import { test, expect, describe } from "bun:test";
import {
  getPaletteRgbMap,
  getPaletteHslMap,
  getPaletteHexMap,
} from "./getPaletteMap";
import {
  MakeCodeColor,
  ArcadePalette,
  type MakeCodePalette,
} from "../../types/color";
import { hexToRgb, rgbToHsl } from "./colorConversion";

describe("getPaletteHexMap", () => {
  test("includes every solid-hex color and skips the rgba transparent entry", () => {
    const map = getPaletteHexMap(ArcadePalette);
    // 16 palette entries, minus the rgba transparent one => 15.
    expect(map.size).toBe(15);
    expect(map.has(MakeCodeColor.TRANSPARENT)).toBe(false);
    expect(map.get(MakeCodeColor.RED)).toBe("#FF2121");
    expect(map.get(MakeCodeColor.BLACK)).toBe("#000000");
  });

  test("returns the same cached Map instance on repeat calls", () => {
    const a = getPaletteHexMap(ArcadePalette);
    const b = getPaletteHexMap(ArcadePalette);
    expect(a).toBe(b);
  });
});

describe("getPaletteRgbMap", () => {
  test("converts each solid hex to RGB and skips transparent", () => {
    const map = getPaletteRgbMap(ArcadePalette);
    expect(map.size).toBe(15);
    expect(map.has(MakeCodeColor.TRANSPARENT)).toBe(false);
    expect(map.get(MakeCodeColor.RED)).toEqual(hexToRgb("#FF2121"));
    expect(map.get(MakeCodeColor.WHITE)).toEqual({ r: 255, g: 255, b: 255 });
  });

  test("is memoized per palette", () => {
    const a = getPaletteRgbMap(ArcadePalette);
    const b = getPaletteRgbMap(ArcadePalette);
    expect(a).toBe(b);
  });

  test("silently skips entries that are not valid hex", () => {
    const palette = {
      [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
      [MakeCodeColor.RED]: "#FF0000",
      [MakeCodeColor.GREEN]: "not-a-color",
    } as unknown as MakeCodePalette;
    const map = getPaletteRgbMap(palette);
    // rgba skipped, invalid hex skipped via the try/catch -> only RED survives.
    expect(map.size).toBe(1);
    expect(map.get(MakeCodeColor.RED)).toEqual({ r: 255, g: 0, b: 0 });
    expect(map.has(MakeCodeColor.GREEN)).toBe(false);
  });
});

describe("getPaletteHslMap", () => {
  test("derives HSL from the RGB map for each color", () => {
    const map = getPaletteHslMap(ArcadePalette);
    expect(map.size).toBe(15);
    expect(map.has(MakeCodeColor.TRANSPARENT)).toBe(false);
    expect(map.get(MakeCodeColor.RED)).toEqual(
      rgbToHsl(...(Object.values(hexToRgb("#FF2121")) as [number, number, number]))
    );
    // White: zero saturation, full lightness.
    expect(map.get(MakeCodeColor.WHITE)).toEqual({ h: 0, s: 0, l: 100 });
  });

  test("is memoized per palette", () => {
    const a = getPaletteHslMap(ArcadePalette);
    const b = getPaletteHslMap(ArcadePalette);
    expect(a).toBe(b);
  });

  test("uses a distinct Map per distinct palette object", () => {
    const other = { ...ArcadePalette } as MakeCodePalette;
    expect(getPaletteHslMap(ArcadePalette)).not.toBe(getPaletteHslMap(other));
  });
});
