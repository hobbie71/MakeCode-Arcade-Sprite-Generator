import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useLine } from "./useLine";
import { useSpriteData } from "./useSpriteData";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
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
  line: useLine(),
  data: useSpriteData(),
  canvas: useCanvas(),
  size: useCanvasSize(),
  color: useColorSelected(),
  sprite: useSprite(),
});

function setup(color: MakeCodeColor) {
  const { result } = renderHookWithProviders(() => useHarness());
  act(() => {
    result.current.size.setWidth(8);
    result.current.size.setHeight(8);
  });
  act(() => {
    result.current.data.initSpriteData();
    result.current.canvas.canvasRef.current = makeFakeCanvas();
    result.current.color.setColor(color);
  });
  return result;
}

describe("useLine", () => {
  test("exposes the pointer handler set", () => {
    const { result } = renderHookWithProviders(() => useLine());
    expect(typeof result.current.handlePointerDown).toBe("function");
    expect(typeof result.current.handlePointerMove).toBe("function");
    expect(typeof result.current.handlePointerUp).toBe("function");
  });

  test("pointer down then up commits a straight horizontal line into sprite data", () => {
    const result = setup(MakeCodeColor.RED);

    act(() => {
      result.current.line.handlePointerDown({ x: 1, y: 1 });
    });
    act(() => {
      result.current.line.handlePointerUp({ x: 4, y: 1 });
    });

    const grid = result.current.sprite.spriteData;
    // Pixels (1..4, 1) should be RED.
    expect(grid[1][1]).toBe(MakeCodeColor.RED);
    expect(grid[1][2]).toBe(MakeCodeColor.RED);
    expect(grid[1][3]).toBe(MakeCodeColor.RED);
    expect(grid[1][4]).toBe(MakeCodeColor.RED);
    // A pixel off the line stays transparent.
    expect(grid[0][0]).toBe(MakeCodeColor.TRANSPARENT);
    expect(grid[2][2]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("commits a diagonal line", () => {
    const result = setup(MakeCodeColor.BLUE);

    act(() => {
      result.current.line.handlePointerDown({ x: 0, y: 0 });
    });
    act(() => {
      result.current.line.handlePointerUp({ x: 3, y: 3 });
    });

    const grid = result.current.sprite.spriteData;
    expect(grid[0][0]).toBe(MakeCodeColor.BLUE);
    expect(grid[1][1]).toBe(MakeCodeColor.BLUE);
    expect(grid[2][2]).toBe(MakeCodeColor.BLUE);
    expect(grid[3][3]).toBe(MakeCodeColor.BLUE);
  });

  test("pointer up without a prior pointer down does not commit anything", () => {
    const result = setup(MakeCodeColor.GREEN);

    act(() => {
      // No handlePointerDown call -> startCoordinates ref is null.
      result.current.line.handlePointerUp({ x: 4, y: 4 });
    });

    const flat = result.current.sprite.spriteData.flat();
    expect(flat.every((c) => c === MakeCodeColor.TRANSPARENT)).toBe(true);
  });

  test("pointer handlers do not throw when no main canvas is attached", () => {
    const { result } = renderHookWithProviders(() => useHarness());
    act(() => {
      result.current.size.setWidth(8);
      result.current.size.setHeight(8);
    });
    act(() => {
      result.current.data.initSpriteData();
    });

    expect(() =>
      act(() => {
        result.current.line.handlePointerDown({ x: 0, y: 0 });
        result.current.line.handlePointerMove({ x: 2, y: 2 });
        result.current.line.handlePointerUp({ x: 4, y: 4 });
      }),
    ).not.toThrow();
  });
});
