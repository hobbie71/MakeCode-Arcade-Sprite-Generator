import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { usePencil } from "./usePencil";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

// happy-dom has no real 2D context, so we hand-build a recording fake canvas.
// drawPixelOnCanvas pulls getContext("2d"); we record fillRect calls to prove
// the pencil actually painted, and bail-out branches don't throw.
type Recorded = [string, ...unknown[]];
function makeFakeCanvas(width = 16, height = 16) {
  const calls: Recorded[] = [];
  const ctx = {
    fillStyle: "",
    fillRect: (...a: unknown[]) => calls.push(["fillRect", ...a]),
    clearRect: (...a: unknown[]) => calls.push(["clearRect", ...a]),
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
    }),
  };
  const canvas = {
    width,
    height,
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
  } as unknown as HTMLCanvasElement;
  return { canvas, calls };
}

// Render the pencil hook + the canvas and sprite contexts so we can inject a
// fake canvas into the shared ref and inspect committed sprite data.
function setup() {
  const fake = makeFakeCanvas();
  const { result } = renderHookWithProviders(() => {
    const pencil = usePencil();
    const canvas = useCanvas();
    const sprite = useSprite();
    return { pencil, canvas, sprite };
  });
  // Seed a 16x16 transparent sprite so setSpriteDataCoordinates has rows to write.
  act(() => {
    const grid = Array.from({ length: 16 }, () =>
      Array(16).fill(MakeCodeColor.TRANSPARENT)
    );
    result.current.sprite.setSpriteData(grid);
  });
  act(() => {
    result.current.canvas.canvasRef.current = fake.canvas;
  });
  return { result, fake };
}

describe("usePencil", () => {
  test("returns the three pointer handlers", () => {
    const { result } = setup();
    expect(typeof result.current.pencil.handlePointerDown).toBe("function");
    expect(typeof result.current.pencil.handlePointerMove).toBe("function");
    expect(typeof result.current.pencil.handlePointerUp).toBe("function");
  });

  test("handlePointerDown paints the initial pixel onto the canvas", () => {
    const { result, fake } = setup();
    act(() => result.current.pencil.handlePointerDown({ x: 2, y: 3 }));
    const fillRects = fake.calls.filter((c) => c[0] === "fillRect");
    expect(fillRects.length).toBeGreaterThan(0);
  });

  test("a down-move-up stroke commits sprite data spanning the dragged line", () => {
    const { result } = setup();
    act(() => result.current.pencil.handlePointerDown({ x: 0, y: 0 }));
    act(() => result.current.pencil.handlePointerMove({ x: 3, y: 0 }));
    act(() => result.current.pencil.handlePointerUp());
    const data = result.current.sprite.spriteData;
    // The Bresenham line from (0,0)->(3,0) with WHITE (default color) should be painted.
    expect(data[0][0]).not.toBe(MakeCodeColor.TRANSPARENT);
    expect(data[0][3]).not.toBe(MakeCodeColor.TRANSPARENT);
    // A pixel well off the stroke stays transparent.
    expect(data[10][10]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("handlers are inert (no throw, no draw) when no canvas is attached", () => {
    const { result } = renderHookWithProviders(() => usePencil());
    // canvasRef.current is null here -> every handler should short-circuit.
    expect(() => {
      act(() => result.current.handlePointerDown({ x: 1, y: 1 }));
      act(() => result.current.handlePointerMove({ x: 2, y: 2 }));
      act(() => result.current.handlePointerUp());
    }).not.toThrow();
  });

  test("handlePointerMove with no prior down still paints (fallback branch)", () => {
    const { result, fake } = setup();
    act(() => result.current.pencil.handlePointerMove({ x: 5, y: 5 }));
    const fillRects = fake.calls.filter((c) => c[0] === "fillRect");
    expect(fillRects.length).toBeGreaterThan(0);
  });
});
