import { describe, it, expect } from "bun:test";

import {
  srgbToOklab,
  oklabNearestColor,
  buildPaletteLab,
  nearestPaletteColorFromLab,
  rgbaToMakeCodeColor,
  DEFAULT_ALPHA_THRESHOLD,
} from "./oklab";
import { srgbToLinear, linearToSrgb } from "./srgbLinear";
import { ArcadePalette, MakeCodeColor, PALETTE_OPTIONS } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";

describe("srgb ⇄ linear", () => {
  it("round-trips channel values", () => {
    for (const v of [0, 1, 18, 64, 127, 200, 255]) {
      const back = linearToSrgb(srgbToLinear(v));
      expect(Math.round(back)).toBe(v);
    }
  });

  it("maps the endpoints exactly", () => {
    expect(srgbToLinear(0)).toBe(0);
    expect(srgbToLinear(255)).toBeCloseTo(1, 6);
    expect(linearToSrgb(0)).toBe(0);
    expect(linearToSrgb(1)).toBeCloseTo(255, 4);
  });
});

describe("srgbToOklab", () => {
  it("puts white at L≈1, neutral chroma", () => {
    const w = srgbToOklab(255, 255, 255);
    expect(w.L).toBeCloseTo(1, 2);
    expect(w.a).toBeCloseTo(0, 2);
    expect(w.b).toBeCloseTo(0, 2);
  });

  it("puts black at L≈0", () => {
    const k = srgbToOklab(0, 0, 0);
    expect(k.L).toBeCloseTo(0, 4);
  });
});

describe("oklabNearestColor on the Arcade palette", () => {
  // Exact palette colours must map to themselves (distance 0).
  it("maps exact palette colours to themselves", () => {
    expect(oklabNearestColor(0x91, 0x46, 0x3d, ArcadePalette)).toBe(
      MakeCodeColor.BROWN
    );
    expect(oklabNearestColor(0xff, 0x21, 0x21, ArcadePalette)).toBe(
      MakeCodeColor.RED
    );
    expect(oklabNearestColor(0xe5, 0xcd, 0xc4, ArcadePalette)).toBe(
      MakeCodeColor.TAN
    );
    expect(oklabNearestColor(255, 255, 255, ArcadePalette)).toBe(
      MakeCodeColor.WHITE
    );
    expect(oklabNearestColor(0, 0, 0, ArcadePalette)).toBe(MakeCodeColor.BLACK);
  });

  // The documented "brown → light orange" bug: a muted, dark orange is brown.
  it("maps a muted dark orange to BROWN, not ORANGE", () => {
    const result = oklabNearestColor(135, 72, 58, ArcadePalette);
    expect(result).toBe(MakeCodeColor.BROWN);
    expect(result).not.toBe(MakeCodeColor.ORANGE);
  });

  // The documented "red seam" bug: grey has undefined hue → defaulted to ~0° =
  // red by the hue matcher. OKLab must snap a neutral grey to a *muted* palette
  // colour (low chroma — e.g. tan, the purples, brown), never a vivid one and
  // above all never red/orange. We assert the property (low chroma) rather than
  // a hard-coded colour, since which muted colour wins depends on the palette.
  it("maps neutral grey to a muted colour, never a vivid one", () => {
    // Chroma of vivid Arcade colours starts ~0.14 (Pink); the muted colours grey
    // can land on top out at Brown ≈ 0.103. 0.13 cleanly separates the two.
    const VIVID_CHROMA = 0.13;
    const chromaOf = (palette: MakeCodePalette, color: MakeCodeColor): number => {
      const hex = palette[color].replace(/^#/, "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const lab = srgbToOklab(r, g, b);
      return Math.hypot(lab.a, lab.b);
    };

    for (const v of [64, 96, 128, 160, 200]) {
      const result = oklabNearestColor(v, v, v, ArcadePalette);
      expect(result).not.toBe(MakeCodeColor.RED);
      expect(result).not.toBe(MakeCodeColor.ORANGE);
      expect(chromaOf(ArcadePalette, result)).toBeLessThan(VIVID_CHROMA);
    }
  });

  it("maps a light grey to WHITE", () => {
    expect(oklabNearestColor(240, 240, 240, ArcadePalette)).toBe(
      MakeCodeColor.WHITE
    );
  });
});

describe("buildPaletteLab / nearestPaletteColorFromLab", () => {
  it("excludes TRANSPARENT and matches the one-shot helper", () => {
    const lab = buildPaletteLab(ArcadePalette);
    expect(lab.some((e) => e.color === MakeCodeColor.TRANSPARENT)).toBe(false);
    expect(lab.length).toBe(15); // 16 enum colours minus TRANSPARENT
    expect(nearestPaletteColorFromLab(0x91, 0x46, 0x3d, lab)).toBe(
      MakeCodeColor.BROWN
    );
  });

  it("throws a clear error on an empty palette (not a cryptic TypeError)", () => {
    expect(() => nearestPaletteColorFromLab(10, 20, 30, [])).toThrow(
      /no opaque colours/
    );
  });
});

describe("rgbaToMakeCodeColor (production per-pixel entry point)", () => {
  const lab = buildPaletteLab(ArcadePalette);

  it("snaps opaque pixels to the nearest palette colour", () => {
    expect(rgbaToMakeCodeColor(0x91, 0x46, 0x3d, 255, lab)).toBe(
      MakeCodeColor.BROWN
    );
    expect(rgbaToMakeCodeColor(255, 33, 33, 255, lab)).toBe(MakeCodeColor.RED);
  });

  it("maps sub-threshold alpha to TRANSPARENT", () => {
    expect(
      rgbaToMakeCodeColor(255, 33, 33, DEFAULT_ALPHA_THRESHOLD - 1, lab)
    ).toBe(MakeCodeColor.TRANSPARENT);
    expect(
      rgbaToMakeCodeColor(255, 33, 33, DEFAULT_ALPHA_THRESHOLD, lab)
    ).not.toBe(MakeCodeColor.TRANSPARENT);
  });

  it("honours a custom alpha threshold", () => {
    expect(rgbaToMakeCodeColor(255, 33, 33, 50, lab, 40)).toBe(MakeCodeColor.RED);
    expect(rgbaToMakeCodeColor(255, 33, 33, 50, lab, 60)).toBe(
      MakeCodeColor.TRANSPARENT
    );
  });
});

describe("every palette colour is self-consistent under the matcher", () => {
  // For each themed palette, snapping one of its own opaque colours must return
  // a slot with the SAME hex (an exact, zero-distance match) — proving the
  // matcher never mis-bins a palette's own colours, whatever its gamut.
  for (const { name, palette } of PALETTE_OPTIONS) {
    it(`${name}: opaque colours map back to their own hex`, () => {
      const lab = buildPaletteLab(palette);
      for (const [key, hex] of Object.entries(palette)) {
        const color = key as MakeCodeColor;
        if (color === MakeCodeColor.TRANSPARENT) continue;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const matched = nearestPaletteColorFromLab(r, g, b, lab);
        expect(palette[matched].toLowerCase()).toBe(hex.toLowerCase());
      }
    });
  }
});
