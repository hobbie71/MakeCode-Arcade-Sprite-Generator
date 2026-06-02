import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CanvasSizeProvider } from "./CanvasSizeContext";
import { useCanvasSize } from "./useCanvasSize";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CanvasSizeProvider>{children}</CanvasSizeProvider>
);

describe("CanvasSizeContext / useCanvasSize", () => {
  test("defaults width and height to 16", () => {
    const { result } = renderHook(() => useCanvasSize(), { wrapper });
    expect(result.current.width).toBe(16);
    expect(result.current.height).toBe(16);
  });

  test("setWidth updates width independently", () => {
    const { result } = renderHook(() => useCanvasSize(), { wrapper });
    act(() => result.current.setWidth(32));
    expect(result.current.width).toBe(32);
    expect(result.current.height).toBe(16);
  });

  test("setHeight updates height independently", () => {
    const { result } = renderHook(() => useCanvasSize(), { wrapper });
    act(() => result.current.setHeight(64));
    expect(result.current.height).toBe(64);
    expect(result.current.width).toBe(16);
  });

  test("setters support updater-function form", () => {
    const { result } = renderHook(() => useCanvasSize(), { wrapper });
    act(() => result.current.setWidth((w) => w * 2));
    act(() => result.current.setHeight((h) => h + 8));
    expect(result.current.width).toBe(32);
    expect(result.current.height).toBe(24);
  });

  test("throws when used outside <CanvasSizeProvider>", () => {
    expect(() => renderHook(() => useCanvasSize())).toThrow(
      /must be inside <CanvasSizeProvider>/
    );
  });
});
