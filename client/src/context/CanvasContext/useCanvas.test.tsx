import { test, expect, describe } from "bun:test";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CanvasProvider } from "./CanvasContext";
import { useCanvas } from "./useCanvas";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CanvasProvider>{children}</CanvasProvider>
);

describe("CanvasContext / useCanvas", () => {
  test("exposes a ref object", () => {
    const { result } = renderHook(() => useCanvas(), { wrapper });
    expect(result.current.canvasRef).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(result.current.canvasRef, "current")).toBe(true);
  });

  test("ref starts at null (no canvas mounted)", () => {
    const { result } = renderHook(() => useCanvas(), { wrapper });
    expect(result.current.canvasRef.current).toBeNull();
  });

  test("ref identity is stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useCanvas(), { wrapper });
    const first = result.current.canvasRef;
    rerender();
    expect(result.current.canvasRef).toBe(first);
  });

  test("throws when used outside <CanvasProvider>", () => {
    expect(() => renderHook(() => useCanvas())).toThrow(/must be inside <CanvasProvider>/);
  });
});
