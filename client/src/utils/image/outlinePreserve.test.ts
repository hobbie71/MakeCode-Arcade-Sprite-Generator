import { describe, it, expect } from "bun:test";
import { ArcadePalette, MakeCodeColor } from "../../types/color";
import { buildPaletteLab } from "../colors/oklab";
import {
  darkestPaletteColor,
  applyOutlineMask,
  computeOutlineMask,
} from "./outlinePreserve";

/** Build an ImageData from a 2-D grid of [r,g,b,a] tuples. */
const imageDataFrom = (grid: [number, number, number, number][][]): ImageData => {
  const height = grid.length;
  const width = grid[0].length;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = grid[y][x];
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }
  return new ImageData(data, width, height);
};

describe("darkestPaletteColor", () => {
  it("picks BLACK as the darkest opaque colour of the Arcade palette", () => {
    expect(darkestPaletteColor(buildPaletteLab(ArcadePalette))).toBe(
      MakeCodeColor.BLACK
    );
  });

  it("falls back to BLACK when the palette has no opaque colours", () => {
    expect(darkestPaletteColor([])).toBe(MakeCodeColor.BLACK);
  });
});

describe("applyOutlineMask", () => {
  const B = MakeCodeColor.BLACK;
  const Y = MakeCodeColor.YELLOW;
  const T = MakeCodeColor.TRANSPARENT;

  it("forces masked opaque pixels to the dark colour", () => {
    const sprite = [
      [Y, Y],
      [Y, Y],
    ];
    const mask = [
      [true, false],
      [false, true],
    ];
    expect(applyOutlineMask(sprite, mask, B)).toEqual([
      [B, Y],
      [Y, B],
    ]);
  });

  it("never paints ink into transparent pixels, even where masked", () => {
    const sprite = [[T, Y]];
    const mask = [[true, true]];
    // (0,0) is transparent → stays transparent; (0,1) is opaque + masked → ink.
    expect(applyOutlineMask(sprite, mask, B)).toEqual([[T, B]]);
  });

  it("leaves the grid untouched where the mask is false", () => {
    const sprite = [[Y, Y]];
    const mask = [[false, false]];
    expect(applyOutlineMask(sprite, mask, B)).toEqual([[Y, Y]]);
  });
});

describe("computeOutlineMask", () => {
  const TRANSP: [number, number, number, number] = [0, 0, 0, 0];
  const BLACK: [number, number, number, number] = [0, 0, 0, 255];
  const WHITE: [number, number, number, number] = [255, 255, 255, 255];

  it("flags a dark opaque pixel that borders transparency", () => {
    // A lone black pixel surrounded by transparency — a silhouette outline.
    const image = imageDataFrom([
      [TRANSP, TRANSP, TRANSP],
      [TRANSP, BLACK, TRANSP],
      [TRANSP, TRANSP, TRANSP],
    ]);
    const mask = computeOutlineMask(image);
    expect(mask[1][1]).toBe(true);
    expect(mask[0][0]).toBe(false); // transparent → never an outline
  });

  it("does not flag a bright opaque pixel (dark-luma gate)", () => {
    const image = imageDataFrom([
      [TRANSP, TRANSP, TRANSP],
      [TRANSP, WHITE, TRANSP],
      [TRANSP, TRANSP, TRANSP],
    ]);
    expect(computeOutlineMask(image)[1][1]).toBe(false);
  });
});
