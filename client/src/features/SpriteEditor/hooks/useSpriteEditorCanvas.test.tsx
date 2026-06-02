import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { useSpriteEditorCanvas } from "./useSpriteEditorCanvas";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

type Recorded = [string, ...unknown[]];
function makeFakeCanvas(width = 8, height = 8) {
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

// Default CanvasSize context is 16x16; initCanvasOnly sizes the sprite grid to
// THAT (not the hook's draw-loop params), so we use 16 in assertions.
function setup(width = 16, height = 16) {
  const fake = makeFakeCanvas();
  const { result } = renderHookWithProviders(() => {
    const editor = useSpriteEditorCanvas(width, height);
    const canvas = useCanvas();
    const sprite = useSprite();
    return { editor, canvas, sprite };
  });
  act(() => {
    result.current.canvas.canvasRef.current = fake.canvas;
  });
  return { result, fake };
}

describe("useSpriteEditorCanvas", () => {
  test("returns an initCanvas function", () => {
    const { result } = setup();
    expect(typeof result.current.editor.initCanvas).toBe("function");
  });

  test("initCanvas initializes empty sprite data and paints the grid", () => {
    const { result, fake } = setup();
    act(() => result.current.editor.initCanvas());
    // initCanvasOnly seeds a 16x16 transparent grid (from CanvasSize context).
    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(16);
    expect(data[0].length).toBe(16);
    expect(data[0][0]).toBe(MakeCodeColor.TRANSPARENT);
    // Drawing the grid records canvas calls (transparent => checkerboard fillRects).
    const drawCalls = fake.calls.filter((c) => c[0] === "fillRect");
    expect(drawCalls.length).toBeGreaterThan(0);
  });

  test("initCanvas is a no-op (no throw) when no canvas is attached", () => {
    const { result } = renderHookWithProviders(() =>
      useSpriteEditorCanvas(16, 16)
    );
    expect(() => act(() => result.current.initCanvas())).not.toThrow();
  });

  test("initCanvas preserves existing artwork by resizing it to the canvas dimensions", () => {
    const { result } = setup();
    // Seed a 4x4 sprite, then init -> data should resize up to the 16x16 canvas size.
    act(() => {
      const small = Array.from({ length: 4 }, () =>
        Array(4).fill(MakeCodeColor.RED)
      );
      result.current.sprite.setSpriteData(small);
    });
    act(() => result.current.editor.initCanvas());
    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(16);
    expect(data[0].length).toBe(16);
  });
});
