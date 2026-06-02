import { test, expect, describe } from "bun:test";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { PreviewCanvasProvider } from "./PreviewCanvasContext";
import { usePreviewCanvas } from "./usePreviewCanvas";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PreviewCanvasProvider>{children}</PreviewCanvasProvider>
);

describe("PreviewCanvasContext / usePreviewCanvas", () => {
  test("exposes a ref object", () => {
    const { result } = renderHook(() => usePreviewCanvas(), { wrapper });
    expect(result.current.previewCanvasRef).toBeTruthy();
    // a React ref is an object with a `current` property
    expect(Object.prototype.hasOwnProperty.call(result.current.previewCanvasRef, "current")).toBe(
      true,
    );
  });

  test("ref starts at null (no canvas mounted)", () => {
    const { result } = renderHook(() => usePreviewCanvas(), { wrapper });
    expect(result.current.previewCanvasRef.current).toBeNull();
  });

  test("ref identity is stable across re-renders", () => {
    const { result, rerender } = renderHook(() => usePreviewCanvas(), { wrapper });
    const first = result.current.previewCanvasRef;
    rerender();
    expect(result.current.previewCanvasRef).toBe(first);
  });

  test("throws when used outside <PreviewCanvasProvider>", () => {
    expect(() => renderHook(() => usePreviewCanvas())).toThrow(
      /must be inside <PreviewCanvasProvider>/,
    );
  });
});
