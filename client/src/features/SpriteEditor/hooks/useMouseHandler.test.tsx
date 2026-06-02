import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { useMouseHandler } from "./useMouseHandler";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";
import { MakeCodeColor } from "../../../types/color";

// Recording fake canvas with a fixed bounding rect at origin, so
// getCanvasCoordinates maps clientX/Y directly through PIXEL_SIZE (20) and zoom (1).
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
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: width * 20,
      height: height * 20,
    }),
  } as unknown as HTMLCanvasElement;
  return { canvas, calls };
}

// Build a fake React.MouseEvent<HTMLCanvasElement> with client coordinates.
function mouseEvent(clientX: number, clientY: number) {
  return { clientX, clientY } as unknown as React.MouseEvent<HTMLCanvasElement>;
}

function setup(attachCanvas = true) {
  const fake = makeFakeCanvas();
  const { result } = renderHookWithProviders(() => {
    const handlers = useMouseHandler();
    const canvas = useCanvas();
    const sprite = useSprite();
    const toolCtx = useToolSelected();
    return { handlers, canvas, sprite, toolCtx };
  });
  // Seed a 16x16 transparent sprite so pencil writes have rows to target.
  act(() => {
    const sprite = Array.from({ length: 16 }, () =>
      Array(16).fill(MakeCodeColor.TRANSPARENT)
    );
    result.current.sprite.setSpriteData(sprite);
  });
  if (attachCanvas) {
    act(() => {
      result.current.canvas.canvasRef.current = fake.canvas;
    });
  }
  return { result, fake };
}

describe("useMouseHandler", () => {
  test("returns the five canvas event handlers", () => {
    const { result } = setup();
    const h = result.current.handlers;
    expect(typeof h.handleMouseDown).toBe("function");
    expect(typeof h.handleMouseUp).toBe("function");
    expect(typeof h.handleMouseMove).toBe("function");
    expect(typeof h.handleMouseEnter).toBe("function");
    expect(typeof h.handleMouseLeave).toBe("function");
  });

  test("every handler is inert (no throw) when no canvas is attached", () => {
    const { result } = setup(false);
    const h = result.current.handlers;
    expect(() => {
      act(() => h.handleMouseDown(mouseEvent(40, 40)));
      act(() => h.handleMouseMove(mouseEvent(60, 60)));
      act(() => h.handleMouseUp(mouseEvent(40, 40)));
      act(() => h.handleMouseEnter(mouseEvent(20, 20)));
      act(() => h.handleMouseLeave());
    }).not.toThrow();
  });

  test("a pencil down/move/up draws onto the sprite (default tool is Pencil)", () => {
    const { result } = setup();
    const h = result.current.handlers;
    // (40,40)->pixel (2,2); (80,40)->pixel (4,2). Drag a short horizontal line.
    act(() => h.handleMouseDown(mouseEvent(40, 40)));
    act(() => h.handleMouseMove(mouseEvent(80, 40)));
    act(() => h.handleMouseUp(mouseEvent(80, 40)));

    const data = result.current.sprite.spriteData;
    expect(data[2][2]).toBe(MakeCodeColor.BLACK);
    expect(data[2][4]).toBe(MakeCodeColor.BLACK);
    // Far-off pixel untouched.
    expect(data[10][10]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("mouseMove outside the logical grid is ignored", () => {
    const { result, fake } = setup();
    const h = result.current.handlers;
    fake.calls.length = 0;
    // clientX 1000 -> pixel 50, which is out of the 16-wide grid -> early return.
    act(() => h.handleMouseMove(mouseEvent(1000, 1000)));
    expect(fake.calls.length).toBe(0);
  });

  test("hovering with no button down draws a dot preview, not sprite data", () => {
    const { result } = setup();
    const h = result.current.handlers;
    // Move without a preceding mouseDown: preview branch; sprite stays transparent.
    act(() => h.handleMouseMove(mouseEvent(60, 60)));
    const data = result.current.sprite.spriteData;
    expect(data[3][3]).toBe(MakeCodeColor.TRANSPARENT);
  });

  test("switching to the Fill tool routes mouseDown without throwing", () => {
    const { result } = setup();
    act(() => result.current.toolCtx.setTool(EditorTools.Fill));
    const h = result.current.handlers;
    expect(() =>
      act(() => h.handleMouseDown(mouseEvent(40, 40)))
    ).not.toThrow();
  });

  test("mouseLeave while idle clears mouse position without throwing", () => {
    const { result } = setup();
    const h = result.current.handlers;
    act(() => h.handleMouseEnter(mouseEvent(40, 40)));
    expect(() => act(() => h.handleMouseLeave())).not.toThrow();
  });
});
