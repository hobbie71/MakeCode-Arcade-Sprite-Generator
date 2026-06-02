import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { MouseCoordinatesProvider } from "./MouseCoordinatesContext";
import { useMouseCoordinates } from "./useMouseCoordinates";

const wrapper = ({ children }: { children: ReactNode }) => (
  <MouseCoordinatesProvider>{children}</MouseCoordinatesProvider>
);

describe("MouseCoordinatesContext / useMouseCoordinates", () => {
  test("defaults: mouseCoordinates is null", () => {
    const { result } = renderHook(() => useMouseCoordinates(), { wrapper });
    expect(result.current.mouseCoordinates).toBeNull();
  });

  test("setMouseCoordinates updates the coordinates", () => {
    const { result } = renderHook(() => useMouseCoordinates(), { wrapper });
    act(() => result.current.setMouseCoordinates({ x: 4, y: 7 }));
    expect(result.current.mouseCoordinates).toEqual({ x: 4, y: 7 });
  });

  test("setMouseCoordinates can reset back to null", () => {
    const { result } = renderHook(() => useMouseCoordinates(), { wrapper });
    act(() => result.current.setMouseCoordinates({ x: 1, y: 2 }));
    expect(result.current.mouseCoordinates).toEqual({ x: 1, y: 2 });
    act(() => result.current.setMouseCoordinates(null));
    expect(result.current.mouseCoordinates).toBeNull();
  });

  test("setMouseCoordinates accepts a functional updater", () => {
    const { result } = renderHook(() => useMouseCoordinates(), { wrapper });
    act(() => result.current.setMouseCoordinates({ x: 10, y: 10 }));
    act(() =>
      result.current.setMouseCoordinates((prev) =>
        prev ? { x: prev.x + 1, y: prev.y - 1 } : null
      )
    );
    expect(result.current.mouseCoordinates).toEqual({ x: 11, y: 9 });
  });

  test("throws when used outside a MouseCoordinatesProvider", () => {
    expect(() => renderHook(() => useMouseCoordinates())).toThrow(
      /must be used within a MouseCoordinatesProvider/
    );
  });
});
