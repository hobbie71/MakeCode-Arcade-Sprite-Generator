import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useSpriteData } from "./useSpriteData";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { MakeCodeColor } from "../../../types/color";

const useHarness = () => ({
  data: useSpriteData(),
  sprite: useSprite(),
  size: useCanvasSize(),
});

describe("useSpriteData", () => {
  test("exposes the expected function set", () => {
    const { result } = renderHookWithProviders(() => useSpriteData());
    expect(typeof result.current.initSpriteData).toBe("function");
    expect(typeof result.current.initCanvasOnly).toBe("function");
    expect(typeof result.current.setSpriteDataCoordinates).toBe("function");
    expect(typeof result.current.commitSpriteData).toBe("function");
    expect(typeof result.current.getCurrentSpriteData).toBe("function");
    expect(typeof result.current.resizeSpriteData).toBe("function");
  });

  test("initSpriteData builds a width x height grid of transparent pixels", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    let returned: MakeCodeColor[][] = [];
    act(() => {
      returned = result.current.data.initSpriteData();
    });

    // Default canvas size is 16x16.
    expect(returned.length).toBe(16);
    expect(returned[0].length).toBe(16);
    expect(returned[0][0]).toBe(MakeCodeColor.TRANSPARENT);
    // State was updated to match.
    expect(result.current.sprite.spriteData.length).toBe(16);
    expect(result.current.sprite.spriteData[0][0]).toBe(
      MakeCodeColor.TRANSPARENT,
    );
  });

  test("initSpriteData respects a changed canvas size", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.size.setWidth(4);
      result.current.size.setHeight(3);
    });

    let returned: MakeCodeColor[][] = [];
    act(() => {
      returned = result.current.data.initSpriteData();
    });

    expect(returned.length).toBe(3);
    expect(returned[0].length).toBe(4);
  });

  test("setSpriteDataCoordinates writes a single coordinate into the ref, commit copies it to state", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.data.initSpriteData();
    });
    act(() => {
      result.current.data.setSpriteDataCoordinates(
        { x: 2, y: 3 },
        MakeCodeColor.RED,
      );
    });

    // Before commit, the ref already reflects the change.
    expect(result.current.data.getCurrentSpriteData()[3][2]).toBe(
      MakeCodeColor.RED,
    );

    act(() => {
      result.current.data.commitSpriteData();
    });

    expect(result.current.sprite.spriteData[3][2]).toBe(MakeCodeColor.RED);
    // Untouched pixel remains transparent.
    expect(result.current.sprite.spriteData[0][0]).toBe(
      MakeCodeColor.TRANSPARENT,
    );
  });

  test("setSpriteDataCoordinates accepts an array of coordinates", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.data.initSpriteData();
    });
    act(() => {
      result.current.data.setSpriteDataCoordinates(
        [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
        MakeCodeColor.BLUE,
      );
      result.current.data.commitSpriteData();
    });

    expect(result.current.sprite.spriteData[0][0]).toBe(MakeCodeColor.BLUE);
    expect(result.current.sprite.spriteData[1][1]).toBe(MakeCodeColor.BLUE);
    expect(result.current.sprite.spriteData[2][2]).toBe(MakeCodeColor.BLUE);
  });

  test("setSpriteDataCoordinates ignores out-of-bounds coordinates", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.size.setWidth(4);
      result.current.size.setHeight(4);
    });
    act(() => {
      result.current.data.initSpriteData();
    });
    act(() => {
      // x >= width and y >= height are skipped; missing rows are skipped.
      result.current.data.setSpriteDataCoordinates(
        [
          { x: 99, y: 0 },
          { x: 0, y: 99 },
        ],
        MakeCodeColor.GREEN,
      );
      result.current.data.commitSpriteData();
    });

    // Nothing changed; whole grid is still transparent.
    const flat = result.current.sprite.spriteData.flat();
    expect(flat.every((c) => c === MakeCodeColor.TRANSPARENT)).toBe(true);
  });

  test("commitSpriteData produces a deep copy (new row arrays)", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.data.initSpriteData();
    });

    const refData = result.current.data.getCurrentSpriteData();
    act(() => {
      result.current.data.commitSpriteData();
    });
    // The committed state rows are not the same array references as the ref rows.
    expect(result.current.sprite.spriteData[0]).not.toBe(refData[0]);
    expect(result.current.sprite.spriteData[0]).toEqual(refData[0]);
  });

  test("resizeSpriteData replaces both ref and state with the given data", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    const newData = [
      [MakeCodeColor.RED, MakeCodeColor.BLUE],
      [MakeCodeColor.GREEN, MakeCodeColor.BLACK],
    ];
    act(() => {
      result.current.data.resizeSpriteData(newData);
    });

    expect(result.current.sprite.spriteData).toEqual(newData);
    expect(result.current.data.getCurrentSpriteData()).toEqual(newData);
  });

  test("initCanvasOnly fills an empty ref to the current size", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.size.setWidth(5);
      result.current.size.setHeight(2);
    });

    let returned: MakeCodeColor[][] = [];
    act(() => {
      returned = result.current.data.initCanvasOnly();
    });

    expect(returned.length).toBe(2);
    expect(returned[0].length).toBe(5);
    expect(returned[0][0]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("initCanvasOnly resizes existing data to preserve artwork when size mismatches", () => {
    const { result } = renderHookWithProviders(() => useHarness());

    // Seed a 2x2 sprite.
    act(() => {
      result.current.data.resizeSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.BLUE],
        [MakeCodeColor.GREEN, MakeCodeColor.BLACK],
      ]);
    });
    // Now grow the canvas to 3x3.
    act(() => {
      result.current.size.setWidth(3);
      result.current.size.setHeight(3);
    });

    let returned: MakeCodeColor[][] = [];
    act(() => {
      returned = result.current.data.initCanvasOnly();
    });

    expect(returned.length).toBe(3);
    expect(returned[0].length).toBe(3);
    // Existing artwork preserved in the top-left.
    expect(returned[0][0]).toBe(MakeCodeColor.RED);
    expect(returned[1][1]).toBe(MakeCodeColor.BLACK);
    // New cells are transparent.
    expect(returned[2][2]).toBe(MakeCodeColor.TRANSPARENT);
  });
});
