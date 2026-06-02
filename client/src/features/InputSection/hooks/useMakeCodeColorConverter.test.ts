import { test, expect, describe } from "bun:test";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useMakeCodeColorConverter } from "./useMakeCodeColorConverter";
import { MakeCodeColor } from "../../../types/color";

// Builds a fake canvas whose 2D context only implements getImageData (the one
// method getSpriteDataFromCanvas actually reads from). happy-dom's real canvas
// has no usable 2D context, so we never touch one.
function fakeCanvas(
  width: number,
  height: number,
  rgbaFlat: number[]
): HTMLCanvasElement {
  const data = new Uint8ClampedArray(rgbaFlat);
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
}

const render = () =>
  renderHookWithProviders(() => useMakeCodeColorConverter());

describe("useMakeCodeColorConverter (default ArcadePalette)", () => {
  test("computes a non-empty set of hue zones from the palette", () => {
    const { result } = render();
    expect(Array.isArray(result.current.hueZones)).toBe(true);
    expect(result.current.hueZones.length).toBeGreaterThan(0);
  });

  test("hueZones reference is memoized across re-renders", () => {
    const { result, rerender } = render();
    const first = result.current.hueZones;
    rerender();
    expect(result.current.hueZones).toBe(first);
  });

  describe("getMakeCodeColorFromRgb", () => {
    test("maps pure red to RED", () => {
      const { result } = render();
      expect(result.current.getMakeCodeColorFromRgb({ r: 255, g: 0, b: 0 })).toBe(
        MakeCodeColor.RED
      );
    });
  });

  describe("getMakeCodeColorFromHsl", () => {
    test("maps hue 0 / lightness 50 to RED", () => {
      const { result } = render();
      expect(
        result.current.getMakeCodeColorFromHsl({ h: 0, s: 100, l: 50 })
      ).toBe(MakeCodeColor.RED);
    });
  });

  describe("getMakeCodeColorFromHex", () => {
    test("maps white and black to their palette entries", () => {
      const { result } = render();
      expect(result.current.getMakeCodeColorFromHex("#FFFFFF")).toBe(
        MakeCodeColor.WHITE
      );
      expect(result.current.getMakeCodeColorFromHex("#000000")).toBe(
        MakeCodeColor.BLACK
      );
    });
  });

  describe("getMakeCodeColorFromRgba", () => {
    test("returns TRANSPARENT when alpha is 0", () => {
      const { result } = render();
      expect(
        result.current.getMakeCodeColorFromRgba({ r: 0, g: 0, b: 0, a: 0 })
      ).toBe(MakeCodeColor.TRANSPARENT);
    });

    test("returns TRANSPARENT below the default alpha threshold (127)", () => {
      const { result } = render();
      expect(
        result.current.getMakeCodeColorFromRgba({ r: 255, g: 0, b: 0, a: 10 })
      ).toBe(MakeCodeColor.TRANSPARENT);
    });

    test("maps an opaque pixel to its color", () => {
      const { result } = render();
      expect(
        result.current.getMakeCodeColorFromRgba({ r: 255, g: 0, b: 0, a: 255 })
      ).toBe(MakeCodeColor.RED);
    });

    test("honors a custom alpha threshold", () => {
      const { result } = render();
      // a=200 is opaque under the default (127) but transparent under 250.
      expect(
        result.current.getMakeCodeColorFromRgba(
          { r: 255, g: 0, b: 0, a: 200 },
          250
        )
      ).toBe(MakeCodeColor.TRANSPARENT);
      expect(
        result.current.getMakeCodeColorFromRgba(
          { r: 255, g: 0, b: 0, a: 200 },
          127
        )
      ).toBe(MakeCodeColor.RED);
    });
  });

  describe("getSpriteDataFromCanvas", () => {
    test("reads a 2x1 canvas into a [height][width] MakeCodeColor grid", () => {
      const { result } = render();
      // pixel 0 = opaque red, pixel 1 = fully transparent
      const canvas = fakeCanvas(2, 1, [255, 0, 0, 255, 0, 0, 0, 0]);
      const sprite = result.current.getSpriteDataFromCanvas(canvas);

      expect(sprite.length).toBe(1); // height rows
      expect(sprite[0].length).toBe(2); // width cols
      expect(sprite[0][0]).toBe(MakeCodeColor.RED);
      expect(sprite[0][1]).toBe(MakeCodeColor.TRANSPARENT);
    });

    test("reads a 1x2 canvas (two rows) correctly", () => {
      const { result } = render();
      // row 0 = opaque white, row 1 = opaque black
      const canvas = fakeCanvas(1, 2, [255, 255, 255, 255, 0, 0, 0, 255]);
      const sprite = result.current.getSpriteDataFromCanvas(canvas);

      expect(sprite.length).toBe(2);
      expect(sprite[0].length).toBe(1);
      expect(sprite[0][0]).toBe(MakeCodeColor.WHITE);
      expect(sprite[1][0]).toBe(MakeCodeColor.BLACK);
    });
  });

  describe("mapCanvasToMakeCodeColors", () => {
    // In happy-dom a freshly created <canvas> has no usable 2D context, so the
    // guard `if (!ctx) throw new Error("Failed to get CTX")` fires. This pins the
    // error-path behavior deterministically.
    test("throws 'Failed to get CTX' when no 2D context is available", () => {
      const { result } = render();
      const canvas = fakeCanvas(2, 1, [255, 0, 0, 255, 0, 0, 0, 0]);
      expect(() => result.current.mapCanvasToMakeCodeColors(canvas, 1)).toThrow(
        /Failed to get CTX/
      );
    });
  });

  test("exposes all converter functions", () => {
    const { result } = render();
    const c = result.current;
    expect(typeof c.getMakeCodeColorFromHsl).toBe("function");
    expect(typeof c.getMakeCodeColorFromRgb).toBe("function");
    expect(typeof c.getMakeCodeColorFromHex).toBe("function");
    expect(typeof c.getMakeCodeColorFromRgba).toBe("function");
    expect(typeof c.getSpriteDataFromCanvas).toBe("function");
    expect(typeof c.mapCanvasToMakeCodeColors).toBe("function");
  });
});
