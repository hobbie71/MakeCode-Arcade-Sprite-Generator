import { test, expect, describe, beforeEach } from "bun:test";
import {
  drawPixelOnCanvas,
  drawPixelOnCanvasTransparent,
  drawSpriteDataOnCanvas,
  drawSpriteDataOnCanvasTransparent,
  drawPixelsOnCanvas,
} from "./drawPixelOnCanvas";
import { MakeCodeColor, ArcadePalette } from "../../../types/color";
import { PIXEL_SIZE } from "../constants/canvas";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

type FillRectCall = {
  fillStyle: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

// Build a fake 2D context + canvas that records every fillRect with the
// fillStyle that was active at call time. happy-dom's real canvas context is
// unreliable, so we never touch a real one.
function makeFakeCanvas() {
  const calls: FillRectCall[] = [];
  const ctx = {
    fillStyle: "",
    fillRect(x: number, y: number, w: number, h: number) {
      calls.push({ fillStyle: this.fillStyle, x, y, w, h });
    },
    clearRect() {},
  };
  const canvas = {
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
  return { canvas, ctx, calls };
}

const RED_HEX = getHexFromMakeCodeColor(MakeCodeColor.RED, ArcadePalette);

describe("drawPixelOnCanvas", () => {
  let fixture: ReturnType<typeof makeFakeCanvas>;
  beforeEach(() => {
    fixture = makeFakeCanvas();
  });

  test("draws a single filled rect at the scaled position with the palette hex", () => {
    drawPixelOnCanvas(
      fixture.canvas,
      { x: 2, y: 3 },
      MakeCodeColor.RED,
      ArcadePalette
    );
    expect(fixture.calls.length).toBe(1);
    expect(fixture.calls[0]).toEqual({
      fillStyle: RED_HEX,
      x: 2 * PIXEL_SIZE,
      y: 3 * PIXEL_SIZE,
      w: PIXEL_SIZE,
      h: PIXEL_SIZE,
    });
  });

  test("honors a custom pixel size", () => {
    drawPixelOnCanvas(
      fixture.canvas,
      { x: 1, y: 1 },
      MakeCodeColor.RED,
      ArcadePalette,
      10
    );
    expect(fixture.calls[0]).toEqual({
      fillStyle: RED_HEX,
      x: 10,
      y: 10,
      w: 10,
      h: 10,
    });
  });

  test("a transparent color draws a 4-quadrant checkerboard instead of one fill", () => {
    drawPixelOnCanvas(
      fixture.canvas,
      { x: 0, y: 0 },
      MakeCodeColor.TRANSPARENT,
      ArcadePalette,
      20
    );
    // 2x2 checkerboard => 4 fillRects, each half the pixel size
    expect(fixture.calls.length).toBe(4);
    expect(fixture.calls.every((c) => c.w === 10 && c.h === 10)).toBe(true);
    const styles = new Set(fixture.calls.map((c) => c.fillStyle));
    expect(styles.has("#aeaeae")).toBe(true);
    expect(styles.has("#dedede")).toBe(true);
  });

  test("a stroke size of 3 paints a 3x3 block (9 rects)", () => {
    drawPixelOnCanvas(
      fixture.canvas,
      { x: 5, y: 5 },
      MakeCodeColor.RED,
      ArcadePalette,
      PIXEL_SIZE,
      3
    );
    expect(fixture.calls.length).toBe(9);
    expect(fixture.calls.every((c) => c.fillStyle === RED_HEX)).toBe(true);
  });

  test("does nothing fatal when getContext returns null", () => {
    const canvas = {
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() =>
      drawPixelOnCanvas(canvas, { x: 0, y: 0 }, MakeCodeColor.RED, ArcadePalette)
    ).not.toThrow();
  });
});

describe("drawPixelOnCanvasTransparent", () => {
  test("skips drawing entirely for a transparent color", () => {
    const { canvas, calls } = makeFakeCanvas();
    drawPixelOnCanvasTransparent(
      canvas,
      { x: 0, y: 0 },
      MakeCodeColor.TRANSPARENT,
      ArcadePalette
    );
    expect(calls.length).toBe(0);
  });

  test("draws a normal filled rect for an opaque color", () => {
    const { canvas, calls } = makeFakeCanvas();
    drawPixelOnCanvasTransparent(
      canvas,
      { x: 1, y: 2 },
      MakeCodeColor.RED,
      ArcadePalette
    );
    expect(calls.length).toBe(1);
    expect(calls[0].x).toBe(PIXEL_SIZE);
    expect(calls[0].y).toBe(2 * PIXEL_SIZE);
    expect(calls[0].fillStyle).toBe(RED_HEX);
  });
});

describe("drawSpriteDataOnCanvas", () => {
  test("draws one rect per opaque pixel and a checkerboard per transparent pixel", () => {
    const { canvas, calls } = makeFakeCanvas();
    // 2x2 sprite: one red, three transparent
    const sprite = [
      [MakeCodeColor.RED, MakeCodeColor.TRANSPARENT],
      [MakeCodeColor.TRANSPARENT, MakeCodeColor.TRANSPARENT],
    ];
    drawSpriteDataOnCanvas(canvas, { x: 0, y: 0 }, sprite, ArcadePalette);
    // 1 opaque pixel (1 rect) + 3 transparent pixels (4 rects each) = 13
    expect(calls.length).toBe(1 + 3 * 4);
  });

  test("offsets every pixel by the start position", () => {
    const { canvas, calls } = makeFakeCanvas();
    const sprite = [[MakeCodeColor.RED]];
    drawSpriteDataOnCanvas(canvas, { x: 2, y: 3 }, sprite, ArcadePalette);
    expect(calls.length).toBe(1);
    expect(calls[0].x).toBe(2 * PIXEL_SIZE);
    expect(calls[0].y).toBe(3 * PIXEL_SIZE);
  });
});

describe("drawSpriteDataOnCanvasTransparent", () => {
  test("only opaque pixels produce draws (transparent pixels are skipped)", () => {
    const { canvas, calls } = makeFakeCanvas();
    const sprite = [
      [MakeCodeColor.RED, MakeCodeColor.TRANSPARENT],
      [MakeCodeColor.TRANSPARENT, MakeCodeColor.BLUE],
    ];
    drawSpriteDataOnCanvasTransparent(
      canvas,
      { x: 0, y: 0 },
      sprite,
      ArcadePalette
    );
    expect(calls.length).toBe(2);
  });
});

describe("drawPixelsOnCanvas", () => {
  test("draws every position with the same color", () => {
    const { canvas, calls } = makeFakeCanvas();
    const positions = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    drawPixelsOnCanvas(canvas, positions, MakeCodeColor.RED, ArcadePalette);
    expect(calls.length).toBe(3);
    expect(calls.every((c) => c.fillStyle === RED_HEX)).toBe(true);
    expect(calls.map((c) => c.x)).toEqual([0, PIXEL_SIZE, 2 * PIXEL_SIZE]);
  });

  test("an empty position list draws nothing", () => {
    const { canvas, calls } = makeFakeCanvas();
    drawPixelsOnCanvas(canvas, [], MakeCodeColor.RED, ArcadePalette);
    expect(calls.length).toBe(0);
  });
});
