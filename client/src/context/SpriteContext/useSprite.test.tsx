import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { SpriteProvider } from "./SpriteContext";
import { useSprite } from "./useSprite";
import { MakeCodeColor } from "../../types/color";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SpriteProvider>{children}</SpriteProvider>
);

describe("SpriteContext / useSprite", () => {
  test("starts with a single empty row", () => {
    const { result } = renderHook(() => useSprite(), { wrapper });
    expect(result.current.spriteData).toEqual([[]]);
  });

  test("exposes setSpriteData as a function", () => {
    const { result } = renderHook(() => useSprite(), { wrapper });
    expect(typeof result.current.setSpriteData).toBe("function");
  });

  test("setSpriteData replaces the grid", () => {
    const { result } = renderHook(() => useSprite(), { wrapper });
    const grid = [
      [MakeCodeColor.RED, MakeCodeColor.BLUE],
      [MakeCodeColor.TRANSPARENT, MakeCodeColor.GREEN],
    ];
    act(() => result.current.setSpriteData(grid));
    expect(result.current.spriteData).toEqual(grid);
    expect(result.current.spriteData.length).toBe(2);
    expect(result.current.spriteData[0][0]).toBe(MakeCodeColor.RED);
  });

  test("setSpriteData accepts an updater function", () => {
    const { result } = renderHook(() => useSprite(), { wrapper });
    act(() => result.current.setSpriteData([[MakeCodeColor.WHITE]]));
    act(() =>
      result.current.setSpriteData((prev) => [...prev, [MakeCodeColor.BLACK]]),
    );
    expect(result.current.spriteData).toEqual([
      [MakeCodeColor.WHITE],
      [MakeCodeColor.BLACK],
    ]);
  });

  test("throws when used outside <SpriteProvider>", () => {
    expect(() => renderHook(() => useSprite())).toThrow(/must be inside <SpriteProvider>/);
  });
});
