import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ZoomProvider } from "./ZoomContext";
import { useZoom } from "./useZoom";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ZoomProvider>{children}</ZoomProvider>
);

describe("ZoomContext / useZoom", () => {
  test("defaults: zoom is 1", () => {
    const { result } = renderHook(() => useZoom(), { wrapper });
    expect(result.current.zoom).toBe(1);
  });

  test("setZoom updates the zoom level", () => {
    const { result } = renderHook(() => useZoom(), { wrapper });
    act(() => result.current.setZoom(4));
    expect(result.current.zoom).toBe(4);
  });

  test("setZoom accepts a functional updater", () => {
    const { result } = renderHook(() => useZoom(), { wrapper });
    act(() => result.current.setZoom((prev) => prev * 2));
    expect(result.current.zoom).toBe(2);
    act(() => result.current.setZoom((prev) => prev + 0.5));
    expect(result.current.zoom).toBeCloseTo(2.5);
  });

  test("throws when used outside <ZoomProvider>", () => {
    expect(() => renderHook(() => useZoom())).toThrow(
      /must be inside <ZoomProvider>/
    );
  });
});
