import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useFill } from "./useFill";
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
  fill: useFill(),
  data: useSpriteData(),
  canvas: useCanvas(),
  size: useCanvasSize(),
  color: useColorSelected(),
  sprite: useSprite(),
});

// Set up a known-size canvas of all transparent pixels, with the canvas ref
// attached and the fill color selected.
function setup(width: number, height: number, fillColor: MakeCodeColor) {
  const { result } = renderHookWithProviders(() => useHarness());
  act(() => {
    result.current.size.setWidth(width);
    result.current.size.setHeight(height);
  });
  act(() => {
    result.current.data.initSpriteData();
    result.current.canvas.canvasRef.current = makeFakeCanvas();
    result.current.color.setColor(fillColor);
  });
  return result;
}

describe("useFill", () => {
  test("exposes handlePointerDown", () => {
    const { result } = renderHookWithProviders(() => useFill());
    expect(typeof result.current.handlePointerDown).toBe("function");
  });

  test("flood-fills a fully transparent grid with the selected color", () => {
    const result = setup(3, 3, MakeCodeColor.RED);

    act(() => {
      result.current.fill.handlePointerDown({ x: 1, y: 1 });
    });

    const flat = result.current.sprite.spriteData.flat();
    expect(flat.length).toBe(9);
    expect(flat.every((c) => c === MakeCodeColor.RED)).toBe(true);
  });

  test("does nothing when target color equals the replacement color", () => {
    // Grid is all transparent; fill with transparent -> no change.
    const result = setup(3, 3, MakeCodeColor.TRANSPARENT);

    act(() => {
      result.current.fill.handlePointerDown({ x: 0, y: 0 });
    });

    const flat = result.current.sprite.spriteData.flat();
    expect(flat.every((c) => c === MakeCodeColor.TRANSPARENT)).toBe(true);
  });

  test("respects color boundaries (does not cross a different-colored barrier)", () => {
    const result = setup(3, 3, MakeCodeColor.GREEN);

    // Paint a vertical BLUE barrier down the middle column (x=1).
    act(() => {
      result.current.data.setSpriteDataCoordinates(
        [
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
        ],
        MakeCodeColor.BLUE,
      );
      result.current.data.commitSpriteData();
    });

    // Fill starting in the left region.
    act(() => {
      result.current.fill.handlePointerDown({ x: 0, y: 0 });
    });

    const grid = result.current.sprite.spriteData;
    // Left column filled green.
    expect(grid[0][0]).toBe(MakeCodeColor.GREEN);
    expect(grid[1][0]).toBe(MakeCodeColor.GREEN);
    expect(grid[2][0]).toBe(MakeCodeColor.GREEN);
    // Barrier untouched.
    expect(grid[0][1]).toBe(MakeCodeColor.BLUE);
    // Right region NOT filled (still transparent).
    expect(grid[0][2]).toBe(MakeCodeColor.TRANSPARENT);
    expect(grid[2][2]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("ignores a pointer-down outside the grid bounds", () => {
    const result = setup(3, 3, MakeCodeColor.RED);

    act(() => {
      result.current.fill.handlePointerDown({ x: 99, y: 99 });
    });

    const flat = result.current.sprite.spriteData.flat();
    expect(flat.every((c) => c === MakeCodeColor.TRANSPARENT)).toBe(true);
  });
});
