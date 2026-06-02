import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useCanvasPreview } from "./useCanvasPreview";
import { usePreviewCanvas } from "../../../context/PreviewCanvasContext/usePreviewCanvas";

type Call = [string, ...unknown[]];

// happy-dom has no reliable 2d canvas context, so build a fake that records
// every draw call. PIXEL_SIZE (20) wide cells, default 16x16 grid sizing here.
function makeFakeCanvas() {
  const calls: Call[] = [];
  const ctx = {
    fillStyle: "",
    fillRect: (...a: unknown[]) => calls.push(["fillRect", ...a]),
    clearRect: (...a: unknown[]) => calls.push(["clearRect", ...a]),
  };
  const canvas = {
    width: 320,
    height: 320,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
  return { canvas, calls };
}

const useHarness = () => ({
  preview: useCanvasPreview(),
  previewCtx: usePreviewCanvas(),
});

describe("useCanvasPreview", () => {
  test("returns the expected draw function set", () => {
    const { result } = renderHookWithProviders(() => useCanvasPreview());
    expect(typeof result.current.clearPreview).toBe("function");
    expect(typeof result.current.drawDotPreview).toBe("function");
    expect(typeof result.current.drawLinePreview).toBe("function");
    expect(typeof result.current.drawSquarePreview).toBe("function");
    expect(typeof result.current.drawCirclePreview).toBe("function");
  });

  test("no-ops gracefully when no preview canvas is attached", () => {
    const { result } = renderHookWithProviders(() => useCanvasPreview());
    // previewCanvasRef.current is null; these should simply return.
    expect(() =>
      act(() => {
        result.current.clearPreview();
        result.current.drawDotPreview({ x: 1, y: 1 });
        result.current.drawLinePreview({ x: 0, y: 0 }, { x: 2, y: 2 });
      }),
    ).not.toThrow();
  });

  test("clearPreview clears the whole canvas", () => {
    const { canvas, calls } = makeFakeCanvas();
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.previewCtx.previewCanvasRef.current = canvas;
      result.current.preview.clearPreview();
    });

    const clears = calls.filter((c) => c[0] === "clearRect");
    expect(clears.length).toBe(1);
    expect(clears[0]).toEqual(["clearRect", 0, 0, 320, 320]);
  });

  test("drawDotPreview clears then draws a filled pixel at the position", () => {
    const { canvas, calls } = makeFakeCanvas();
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.previewCtx.previewCanvasRef.current = canvas;
      // A non-transparent color so it takes the fillRect branch.
      result.current.preview.drawDotPreview({ x: 1, y: 2 });
    });

    expect(calls.some((c) => c[0] === "clearRect")).toBe(true);
    const fills = calls.filter((c) => c[0] === "fillRect");
    expect(fills.length).toBe(1);
    // x*PIXEL_SIZE=20, y*PIXEL_SIZE=40, cell 20x20.
    expect(fills[0]).toEqual(["fillRect", 20, 40, 20, 20]);
  });

  test("drawLinePreview draws one filled cell per coordinate along the line", () => {
    const { canvas, calls } = makeFakeCanvas();
    const { result } = renderHookWithProviders(() => useHarness());

    act(() => {
      result.current.previewCtx.previewCanvasRef.current = canvas;
      // Horizontal line from (0,0) to (3,0): 4 pixels.
      result.current.preview.drawLinePreview({ x: 0, y: 0 }, { x: 3, y: 0 });
    });

    const fills = calls.filter((c) => c[0] === "fillRect");
    expect(fills.length).toBe(4);
  });
});
