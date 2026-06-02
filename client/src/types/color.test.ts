import { test, expect, describe } from "bun:test";
import {
  MakeCodeColor,
  getColorName,
  ColorOrder,
  ArcadePalette,
  ALL_PALETTES,
} from "./color";

describe("MakeCodeColor enum", () => {
  test("maps semantic names to MakeCode literal characters", () => {
    expect(MakeCodeColor.TRANSPARENT).toBe(".");
    expect(MakeCodeColor.WHITE).toBe("1");
    expect(MakeCodeColor.RED).toBe("2");
    expect(MakeCodeColor.BLACK).toBe("f");
  });

  test("has exactly 16 distinct color members", () => {
    const values = Object.values(MakeCodeColor);
    expect(values.length).toBe(16);
    expect(new Set(values).size).toBe(16);
  });

  test("uses the MakeCode hex digit + '.' alphabet", () => {
    const expected = [".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    expect(new Set(Object.values(MakeCodeColor))).toEqual(new Set(expected));
  });
});

describe("getColorName", () => {
  test("returns the human-readable name for a known color", () => {
    expect(getColorName(MakeCodeColor.TRANSPARENT)).toBe("Transparent");
    expect(getColorName(MakeCodeColor.LIGHT_BLUE)).toBe("Light Blue");
    expect(getColorName(MakeCodeColor.BLACK)).toBe("Black");
  });

  test("names every enum member (none fall through to Unknown)", () => {
    for (const color of Object.values(MakeCodeColor)) {
      expect(getColorName(color)).not.toBe("Unknown");
    }
  });

  test("falls back to 'Unknown' for an unmapped value", () => {
    expect(getColorName("z" as MakeCodeColor)).toBe("Unknown");
  });
});

describe("ColorOrder", () => {
  test("lists all 16 colors with no duplicates", () => {
    expect(ColorOrder.length).toBe(16);
    expect(new Set(ColorOrder).size).toBe(16);
  });

  test("starts with transparent and ends with black", () => {
    expect(ColorOrder[0]).toBe(MakeCodeColor.TRANSPARENT);
    expect(ColorOrder[ColorOrder.length - 1]).toBe(MakeCodeColor.BLACK);
  });
});

describe("palettes", () => {
  test("ArcadePalette defines a swatch for every color", () => {
    for (const color of Object.values(MakeCodeColor)) {
      expect(typeof ArcadePalette[color]).toBe("string");
      expect(ArcadePalette[color].length > 0).toBe(true);
    }
    expect(ArcadePalette[MakeCodeColor.TRANSPARENT]).toBe("rgba(0,0,0,0)");
    expect(ArcadePalette[MakeCodeColor.WHITE]).toBe("#FFFFFF");
  });

  test("ALL_PALETTES exposes 10 named palettes, each fully populated", () => {
    expect(ALL_PALETTES.length).toBe(10);
    const names = ALL_PALETTES.map((p) => p.name);
    expect(names).toContain("Arcade");
    expect(new Set(names).size).toBe(10);

    for (const { palette } of ALL_PALETTES) {
      for (const color of Object.values(MakeCodeColor)) {
        expect(typeof palette[color]).toBe("string");
      }
      // Transparent is the alpha-zero entry in every palette.
      expect(palette[MakeCodeColor.TRANSPARENT]).toBe("rgba(0,0,0,0)");
    }
  });
});
