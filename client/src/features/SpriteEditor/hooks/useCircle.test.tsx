import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useCircle } from "./useCircle";
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
  circle: useCircle(),
  data: useSpriteData(),
  canvas: useCanvas(),
  size: useCanvasSize(),
  color: useColorSelected(),
  sprite: useSprite(),
});

function setup(color: MakeCodeColor, w = 9, h = 9) {
  const { result } = renderHookWithProviders(() => useHarness());
  act(() => {
    result.current.size.setWidth(w);
    result.current.size.setHeight(h);
  });
  act(() => {
    result.current.data.initSpriteData();
    result.current.canvas.canvasRef.current = makeFakeCanvas();
    result.current.color.setColor(color);
  });
  return result;
}

describe("useCircle", () => {
  test("exposes the pointer handler set", () => {
    const { result } = renderHookWithProviders(() => useCircle());
    expect(typeof result.current.handlePointerDown).toBe("function");
    expect(typeof result.current.handlePointerMove).toBe("function");
    expect(typeof result.current.handlePointerUp).toBe("function");
  });

  test("draws the four cardinal points of a circle around the center", () => {
    const result = setup(MakeCodeColor.RED);

    // Center (4,4), end (4,1) -> radius round(sqrt(9)) = 3.
    act(() => {
      result.current.circle.handlePointerDown({ x: 4, y: 4 });
    });
    act(() => {
      result.current.circle.handlePointerUp({ x: 4, y: 1 });
    });

    const grid = result.current.sprite.spriteData;
    // Cardinal points: (cx, cy+r), (cx, cy-r), (cx+r, cy), (cx-r, cy).
    expect(grid[7][4]).toBe(MakeCodeColor.RED); // (4,7)
    expect(grid[1][4]).toBe(MakeCodeColor.RED); // (4,1)
    expect(grid[4][7]).toBe(MakeCodeColor.RED); // (7,4)
    expect(grid[4][1]).toBe(MakeCodeColor.RED); // (1,4)
    // The center itself is not on the circle outline.
    expect(grid[4][4]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("a zero-radius circle paints just the center pixel", () => {
    const result = setup(MakeCodeColor.GREEN);

    act(() => {
      result.current.circle.handlePointerDown({ x: 2, y: 2 });
    });
    act(() => {
      // end == start -> radius 0 -> single point at the center.
      result.current.circle.handlePointerUp({ x: 2, y: 2 });
    });

    const grid = result.current.sprite.spriteData;
    expect(grid[2][2]).toBe(MakeCodeColor.GREEN);
    // Count painted pixels: only one.
    const painted = grid.flat().filter((c) => c === MakeCodeColor.GREEN);
    expect(painted.length).toBe(1);
  });

  test("pointer up without a prior pointer down does not commit anything", () => {
    const result = setup(MakeCodeColor.BLUE);

    act(() => {
      result.current.circle.handlePointerUp({ x: 4, y: 1 });
    });

    const flat = result.current.sprite.spriteData.flat();
    expect(flat.every((c) => c === MakeCodeColor.TRANSPARENT)).toBe(true);
  });

  test("pointer handlers do not throw when no main canvas is attached", () => {
    const { result } = renderHookWithProviders(() => useHarness());
    act(() => {
      result.current.size.setWidth(9);
      result.current.size.setHeight(9);
      result.current.data.initSpriteData();
    });

    expect(() =>
      act(() => {
        result.current.circle.handlePointerDown({ x: 4, y: 4 });
        result.current.circle.handlePointerMove({ x: 4, y: 2 });
        result.current.circle.handlePointerUp({ x: 4, y: 1 });
      }),
    ).not.toThrow();
  });
});
