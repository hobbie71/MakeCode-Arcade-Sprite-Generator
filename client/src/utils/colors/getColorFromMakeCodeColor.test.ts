import { test, expect, describe } from "bun:test";
import {
  getHexFromMakeCodeColor,
  getRgbaFromMakeCodeColor,
  getHslaFromMakeCodeColor,
} from "./getColorFromMakeCodeColor";
import {
  MakeCodeColor,
  ArcadePalette,
  MattePalette,
  type MakeCodePalette,
} from "../../types/color";
import { hexToRgba, hexToHsla } from "./colorConversion";

describe("getHexFromMakeCodeColor", () => {
  test("returns the hex for a color from the default (Arcade) palette", () => {
    expect(getHexFromMakeCodeColor(MakeCodeColor.RED)).toBe("#FF2121");
    expect(getHexFromMakeCodeColor(MakeCodeColor.WHITE)).toBe("#FFFFFF");
    expect(getHexFromMakeCodeColor(MakeCodeColor.BLACK)).toBe("#000000");
  });

  test("returns the transparent sentinel for the TRANSPARENT color", () => {
    expect(getHexFromMakeCodeColor(MakeCodeColor.TRANSPARENT)).toBe(
      "rgba(0,0,0,0)"
    );
  });

  test("honors a supplied palette over the default", () => {
    expect(getHexFromMakeCodeColor(MakeCodeColor.RED, MattePalette)).toBe(
      "#FF004D"
    );
    // Same color resolves differently per palette.
    expect(getHexFromMakeCodeColor(MakeCodeColor.RED, MattePalette)).not.toBe(
      getHexFromMakeCodeColor(MakeCodeColor.RED, ArcadePalette)
    );
  });

  test("falls back to the palette's transparent entry when the color is missing", () => {
    const sparse = {
      [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
    } as unknown as MakeCodePalette;
    expect(getHexFromMakeCodeColor(MakeCodeColor.RED, sparse)).toBe(
      "rgba(0,0,0,0)"
    );
  });

  test("falls back to the literal transparent string when even transparent is absent", () => {
    const empty = {} as unknown as MakeCodePalette;
    expect(getHexFromMakeCodeColor(MakeCodeColor.GREEN, empty)).toBe(
      "rgba(0,0,0,0)"
    );
  });
});

describe("getRgbaFromMakeCodeColor", () => {
  test("converts a palette hex into RGBA", () => {
    // Arcade RED = #FF2121
    expect(getRgbaFromMakeCodeColor(MakeCodeColor.RED)).toEqual(
      hexToRgba("#FF2121")
    );
    expect(getRgbaFromMakeCodeColor(MakeCodeColor.WHITE)).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: 255,
    });
  });

  test("uses a custom palette", () => {
    expect(getRgbaFromMakeCodeColor(MakeCodeColor.RED, MattePalette)).toEqual(
      hexToRgba("#FF004D")
    );
  });
});

describe("getHslaFromMakeCodeColor", () => {
  test("converts a palette hex into HSLA", () => {
    expect(getHslaFromMakeCodeColor(MakeCodeColor.RED)).toEqual(
      hexToHsla("#FF2121")
    );
  });

  test("white has full lightness and zero saturation", () => {
    const hsla = getHslaFromMakeCodeColor(MakeCodeColor.WHITE);
    expect(hsla.l).toBe(100);
    expect(hsla.s).toBe(0);
    // hexToHsla normalizes the 0-255 alpha byte to 0-1.
    expect(hsla.a).toBe(1);
  });
});
