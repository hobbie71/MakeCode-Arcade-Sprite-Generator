import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useEraser } from "./useEraser";
import { useSpriteData } from "./useSpriteData";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

function makeFakeCanvas() {
  const ctx = {
    fillStyle: "",
    fillRect: () => {},
    clearRect: () => {},
  };
  return {
    width: 320,
    height: 320,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
}

const useHarness = () => ({
  eraser: useEraser(),
  data: useSpriteData(),
  canvas: useCanvas(),
  size: useCanvasSize(),
  stroke: useStrokeSize(),
  sprite: useSprite(),
});

// Paint the whole grid a solid color so we can observe erasing.
function setupPainted(w: number, h: number, color: MakeCodeColor) {
  const { result } = renderHookWithProviders(() => useHarness());
  act(() => {
    result.current.size.setWidth(w);
    result.current.size.setHeight(h);
  });
  act(() => {
    result.current.data.initSpriteData();
    result.current.canvas.canvasRef.current = makeFakeCanvas();
  });
  act(() => {
    const coords = [];
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) coords.push({ x, y });
    result.current.data.setSpriteDataCoordinates(coords, color);
    result.current.data.commitSpriteData();
  });
  return result;
}

describe("useEraser", () => {
  test("exposes the pointer handler set", () => {
    const { result } = renderHookWithProviders(() => useEraser());
    expect(typeof result.current.handlePointerDown).toBe("function");
    expect(typeof result.current.handlePointerMove).toBe("function");
    expect(typeof result.current.handlePointerUp).toBe("function");
  });

  test("pointer down erases a pixel to transparent, commit makes it visible in state", () => {
    const result = setupPainted(4, 4, MakeCodeColor.RED);

    act(() => {
      result.current.eraser.handlePointerDown({ x: 2, y: 1 });
    });
    act(() => {
      result.current.eraser.handlePointerUp();
    });

    const grid = result.current.sprite.spriteData;
    expect(grid[1][2]).toBe(MakeCodeColor.TRANSPARENT);
    // A neighbor remains painted (stroke size 1 erases just one pixel).
    expect(grid[0][0]).toBe(MakeCodeColor.RED);
  });

  test("pointer move erases additional pixels along the drag", () => {
    const result = setupPainted(4, 4, MakeCodeColor.BLUE);

    act(() => {
      result.current.eraser.handlePointerDown({ x: 0, y: 0 });
      result.current.eraser.handlePointerMove({ x: 1, y: 0 });
      result.current.eraser.handlePointerMove({ x: 2, y: 0 });
    });
    act(() => {
      result.current.eraser.handlePointerUp();
    });

    const grid = result.current.sprite.spriteData;
    expect(grid[0][0]).toBe(MakeCodeColor.TRANSPARENT);
    expect(grid[0][1]).toBe(MakeCodeColor.TRANSPARENT);
    expect(grid[0][2]).toBe(MakeCodeColor.TRANSPARENT);
    // Untouched pixel still painted.
    expect(grid[3][3]).toBe(MakeCodeColor.BLUE);
  });

  test("stroke size 3 erases a 3x3 block around the pointer", () => {
    const result = setupPainted(5, 5, MakeCodeColor.GREEN);

    act(() => {
      result.current.stroke.setStrokeSize(3);
    });
    act(() => {
      result.current.eraser.handlePointerDown({ x: 2, y: 2 });
    });
    act(() => {
      result.current.eraser.handlePointerUp();
    });

    const grid = result.current.sprite.spriteData;
    // 3x3 block centered at (2,2): x,y in 1..3 erased.
    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        expect(grid[y][x]).toBe(MakeCodeColor.TRANSPARENT);
      }
    }
    // Corner outside the block still painted.
    expect(grid[0][0]).toBe(MakeCodeColor.GREEN);
  });

  test("handlers do not throw when no canvas is attached", () => {
    const { result } = renderHookWithProviders(() => useHarness());
    act(() => {
      result.current.size.setWidth(4);
      result.current.size.setHeight(4);
      result.current.data.initSpriteData();
    });

    expect(() =>
      act(() => {
        result.current.eraser.handlePointerDown({ x: 0, y: 0 });
        result.current.eraser.handlePointerMove({ x: 1, y: 1 });
        result.current.eraser.handlePointerUp();
      }),
    ).not.toThrow();
  });
});
