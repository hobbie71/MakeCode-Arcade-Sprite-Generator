import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { useRectangle } from "./useRectangle";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

// Recording fake canvas (happy-dom has no real 2D context).
type Recorded = [string, ...unknown[]];
function makeFakeCanvas(width = 16, height = 16) {
  const calls: Recorded[] = [];
  const ctx = {
    fillStyle: "",
    fillRect: (...a: unknown[]) => calls.push(["fillRect", ...a]),
    clearRect: (...a: unknown[]) => calls.push(["clearRect", ...a]),
  };
  const canvas = {
    width,
    height,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
  return { canvas, calls };
}

function setup() {
  const fake = makeFakeCanvas();
  const { result } = renderHookWithProviders(() => {
    const rect = useRectangle();
    const canvas = useCanvas();
    const sprite = useSprite();
    return { rect, canvas, sprite };
  });
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

describe("useRectangle", () => {
  test("returns the three pointer handlers", () => {
    const { result } = setup();
    expect(typeof result.current.rect.handlePointerDown).toBe("function");
    expect(typeof result.current.rect.handlePointerMove).toBe("function");
    expect(typeof result.current.rect.handlePointerUp).toBe("function");
  });

  test("pointerMove before a pointerDown is a no-op (no start set)", () => {
    const { result, fake } = setup();
    fake.calls.length = 0;
    expect(() =>
      act(() => result.current.rect.handlePointerMove({ x: 5, y: 5 }))
    ).not.toThrow();
  });

  test("a full down/move/up draws the rectangle outline into sprite data", () => {
    const { result } = setup();
    act(() => result.current.rect.handlePointerDown({ x: 1, y: 1 }));
    act(() => result.current.rect.handlePointerMove({ x: 4, y: 4 }));
    act(() => result.current.rect.handlePointerUp({ x: 4, y: 4 }));

    const data = result.current.sprite.spriteData;
    // Corners of the outline are painted (default color BLACK).
    expect(data[1][1]).toBe(MakeCodeColor.BLACK);
    expect(data[1][4]).toBe(MakeCodeColor.BLACK);
    expect(data[4][1]).toBe(MakeCodeColor.BLACK);
    expect(data[4][4]).toBe(MakeCodeColor.BLACK);
    // Interior is NOT filled (outline only).
    expect(data[2][2]).toBe(MakeCodeColor.TRANSPARENT);
    expect(data[3][3]).toBe(MakeCodeColor.TRANSPARENT);
    // An edge midpoint is painted.
    expect(data[1][2]).toBe(MakeCodeColor.BLACK);
  });

  test("pointerUp records fillRect draw calls on the canvas", () => {
    const { result, fake } = setup();
    act(() => result.current.rect.handlePointerDown({ x: 0, y: 0 }));
    fake.calls.length = 0;
    act(() => result.current.rect.handlePointerUp({ x: 2, y: 2 }));
    const fillRects = fake.calls.filter((c) => c[0] === "fillRect");
    expect(fillRects.length).toBeGreaterThan(0);
  });

  test("pointerUp without a canvas does not throw", () => {
    const { result } = renderHookWithProviders(() => useRectangle());
    expect(() => {
      act(() => result.current.handlePointerDown({ x: 0, y: 0 }));
      act(() => result.current.handlePointerUp({ x: 3, y: 3 }));
    }).not.toThrow();
  });
});
