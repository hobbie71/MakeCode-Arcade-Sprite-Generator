import { test, expect, describe } from "bun:test";
import {
  hslToMakeCodeColor,
  rgbToMakeCodeColor,
  hexToMakeCodeColor,
  rgbaToMakeCodeColor,
} from "./getMakeCodeColor";
import { MakeCodeColor } from "../../types/color";
import type { HueZone } from "../../types/hueZone";

// A small but realistic zone catalog:
//  - A "red-ish" zone that WRAPS around 0 (330..360 and 0..30).
//  - A "green" zone (90..150).
//  - A "blue" zone (210..270).
// Each hue zone has two luminance bands: a dark variant and a light variant,
// splitting at 50% lightness.
const lumBands = (
  dark: MakeCodeColor,
  light: MakeCodeColor
): HueZone["luminanceZone"] => [
  { color: dark, luminance: 25, zoneStart: 0, zoneEnd: 49 },
  { color: light, luminance: 75, zoneStart: 50, zoneEnd: 100 },
];

const hueZones: HueZone[] = [
  // Wrap-around red zone.
  {
    zoneStart: 330,
    zoneEnd: 30,
    luminanceZone: lumBands(MakeCodeColor.BROWN, MakeCodeColor.RED),
  },
  {
    zoneStart: 90,
    zoneEnd: 150,
    luminanceZone: lumBands(MakeCodeColor.TEAL, MakeCodeColor.GREEN),
  },
  {
    zoneStart: 210,
    zoneEnd: 270,
    luminanceZone: lumBands(MakeCodeColor.BLUE, MakeCodeColor.LIGHT_BLUE),
  },
];

describe("hslToMakeCodeColor", () => {
  test("picks the light band of the matching hue zone", () => {
    // hue 0 -> wrap-around red zone, lightness 50 -> light band.
    expect(hslToMakeCodeColor(0, 50, hueZones)).toBe(MakeCodeColor.RED);
  });

  test("picks the dark band of the matching hue zone", () => {
    // hue 0 -> red zone, lightness 25 -> dark band.
    expect(hslToMakeCodeColor(0, 25, hueZones)).toBe(MakeCodeColor.BROWN);
  });

  test("matches a non-wrapping zone (green)", () => {
    expect(hslToMakeCodeColor(120, 60, hueZones)).toBe(MakeCodeColor.GREEN);
    expect(hslToMakeCodeColor(120, 10, hueZones)).toBe(MakeCodeColor.TEAL);
  });

  test("matches the high side of a wrap-around zone", () => {
    // hue 340 is >= zoneStart (330) so it wraps into the red zone.
    expect(hslToMakeCodeColor(340, 80, hueZones)).toBe(MakeCodeColor.RED);
  });

  test("throws when no hue zone covers the hue", () => {
    // hue 200 falls in none of the configured zones.
    expect(() => hslToMakeCodeColor(200, 50, hueZones)).toThrow(
      /can't find HueZone/
    );
  });

  test("throws when no luminance band covers the lightness", () => {
    // The red zone bands only cover 0..100, so a value above range fails.
    expect(() => hslToMakeCodeColor(0, 150, hueZones)).toThrow(
      /can't find LuminanceZone/
    );
  });
});

describe("rgbToMakeCodeColor", () => {
  test("pure red lands in the red zone, light band", () => {
    // rgbToHsl(255,0,0) = {h:0, s:100, l:50}
    expect(rgbToMakeCodeColor(255, 0, 0, hueZones)).toBe(MakeCodeColor.RED);
  });

  test("pure green lands in the green zone, light band", () => {
    // rgbToHsl(0,255,0) = {h:120, l:50}
    expect(rgbToMakeCodeColor(0, 255, 0, hueZones)).toBe(MakeCodeColor.GREEN);
  });

  test("pure blue lands in the blue zone", () => {
    // rgbToHsl(0,0,255) = {h:240, l:50}
    expect(rgbToMakeCodeColor(0, 0, 255, hueZones)).toBe(MakeCodeColor.LIGHT_BLUE);
  });

  test("a dark blue lands in the blue dark band", () => {
    // rgbToHsl(0,0,80) -> hue 240, low lightness.
    expect(rgbToMakeCodeColor(0, 0, 80, hueZones)).toBe(MakeCodeColor.BLUE);
  });
});

describe("hexToMakeCodeColor", () => {
  test("converts a hex string through to a MakeCode color", () => {
    expect(hexToMakeCodeColor("#ff0000", hueZones)).toBe(MakeCodeColor.RED);
    expect(hexToMakeCodeColor("#00ff00", hueZones)).toBe(MakeCodeColor.GREEN);
  });

  test("propagates the no-zone throw", () => {
    // Cyan (#00ffff) is hue 180 -> no zone.
    expect(() => hexToMakeCodeColor("#00ffff", hueZones)).toThrow(
      /can't find HueZone/
    );
  });
});

describe("rgbaToMakeCodeColor", () => {
  test("returns TRANSPARENT when alpha is below the default threshold", () => {
    expect(rgbaToMakeCodeColor(255, 0, 0, 0, hueZones)).toBe(
      MakeCodeColor.TRANSPARENT
    );
    expect(rgbaToMakeCodeColor(255, 0, 0, 126, hueZones)).toBe(
      MakeCodeColor.TRANSPARENT
    );
  });

  test("delegates to color mapping when alpha meets the threshold", () => {
    // alpha 127 == default threshold -> NOT transparent (a < threshold is false).
    expect(rgbaToMakeCodeColor(255, 0, 0, 127, hueZones)).toBe(
      MakeCodeColor.RED
    );
    expect(rgbaToMakeCodeColor(255, 0, 0, 255, hueZones)).toBe(
      MakeCodeColor.RED
    );
  });

  test("honors a custom alpha threshold", () => {
    // With threshold 10, alpha 50 is opaque enough to map normally.
    expect(rgbaToMakeCodeColor(0, 255, 0, 50, hueZones, 10)).toBe(
      MakeCodeColor.GREEN
    );
    // ...and alpha 5 is below it -> transparent.
    expect(rgbaToMakeCodeColor(0, 255, 0, 5, hueZones, 10)).toBe(
      MakeCodeColor.TRANSPARENT
    );
  });
});
