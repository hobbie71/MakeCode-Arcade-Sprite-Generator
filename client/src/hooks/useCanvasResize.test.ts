import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../test/test-utils";
import { useCanvasResize } from "./useCanvasResize";
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../types/color";

// Render the hook under test alongside the contexts it mutates, so we can read
// the resulting canvas size + sprite data back out. No real <canvas> is touched
// — updateCanvasSize only reshapes the sprite-data 2D array and sets dimensions.
const renderResize = () =>
  renderHookWithProviders(() => ({
    resize: useCanvasResize(),
    canvasSize: useCanvasSize(),
    sprite: useSprite(),
  }));

describe("useCanvasResize", () => {
  test("returns a stable updateCanvasSize function", () => {
    const { result, rerender } = renderResize();
    expect(typeof result.current.resize.updateCanvasSize).toBe("function");
    const first = result.current.resize.updateCanvasSize;
    rerender();
    expect(result.current.resize.updateCanvasSize).toBe(first);
  });

  test("updates both width and height in the canvas-size context", () => {
    const { result } = renderResize();
    // Provider defaults are 16x16.
    expect(result.current.canvasSize.width).toBe(16);
    expect(result.current.canvasSize.height).toBe(16);

    act(() => {
      result.current.resize.updateCanvasSize(8, 24);
    });

    expect(result.current.canvasSize.width).toBe(8);
    expect(result.current.canvasSize.height).toBe(24);
  });

  test("reshapes sprite data to the new dimensions, padding with TRANSPARENT", () => {
    const { result } = renderResize();

    // Seed some sprite data through the sprite context.
    act(() => {
      result.current.sprite.setSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.BLUE],
        [MakeCodeColor.GREEN, MakeCodeColor.YELLOW],
      ]);
    });

    act(() => {
      result.current.resize.updateCanvasSize(3, 3);
    });

    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(3);
    expect(data.every((row) => row.length === 3)).toBe(true);

    // Preserved cells from the original 2x2.
    expect(data[0][0]).toBe(MakeCodeColor.RED);
    expect(data[0][1]).toBe(MakeCodeColor.BLUE);
    expect(data[1][0]).toBe(MakeCodeColor.GREEN);
    expect(data[1][1]).toBe(MakeCodeColor.YELLOW);

    // New cells are padded transparent.
    expect(data[0][2]).toBe(MakeCodeColor.TRANSPARENT);
    expect(data[2][2]).toBe(MakeCodeColor.TRANSPARENT);
    expect(data[2][0]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("shrinking drops the out-of-bounds cells", () => {
    const { result } = renderResize();

    act(() => {
      result.current.sprite.setSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.BLUE],
        [MakeCodeColor.GREEN, MakeCodeColor.YELLOW],
      ]);
    });

    act(() => {
      result.current.resize.updateCanvasSize(1, 1);
    });

    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(1);
    expect(data[0].length).toBe(1);
    expect(data[0][0]).toBe(MakeCodeColor.RED);
  });
});
