import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { usePasteData } from "./usePasteData";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

// Recording fake canvas. pasteSpriteData draws each pixel via drawPixelOnCanvas
// (needs getContext) and then stores the grid; pasteCanvas additionally reads
// pixels back via getImageData.
type Recorded = [string, ...unknown[]];
function makeFakeCanvas(
  width = 16,
  height = 16,
  fill = (i: number) => (i % 4 === 3 ? 255 : 0)
) {
  const calls: Recorded[] = [];
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i++) data[i] = fill(i);
  const ctx = {
    fillStyle: "",
    fillRect: (...a: unknown[]) => calls.push(["fillRect", ...a]),
    clearRect: () => {},
    getImageData: () => ({ data, width, height }),
  };
  const canvas = {
    width,
    height,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
  return { canvas, calls };
}

// Build a width x height grid of a single MakeCodeColor.
function grid(width: number, height: number, color: MakeCodeColor) {
  return Array.from({ length: height }, () => Array(width).fill(color));
}

function setup() {
  const fake = makeFakeCanvas();
  const { result } = renderHookWithProviders(() => {
    const paste = usePasteData();
    const canvas = useCanvas();
    const sprite = useSprite();
    return { paste, canvas, sprite };
  });
  act(() => {
    result.current.canvas.canvasRef.current = fake.canvas;
  });
  return { result, fake };
}

describe("usePasteData", () => {
  test("exposes pasteSpriteData and pasteCanvas", () => {
    const { result } = setup();
    expect(typeof result.current.paste.pasteSpriteData).toBe("function");
    expect(typeof result.current.paste.pasteCanvas).toBe("function");
  });

  test("pasteSpriteData stores the given grid in sprite state", () => {
    const { result } = setup();
    const incoming = grid(16, 16, MakeCodeColor.RED);
    act(() => result.current.paste.pasteSpriteData(incoming));
    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(16);
    expect(data[0].length).toBe(16);
    expect(data[0][0]).toBe(MakeCodeColor.RED);
    expect(data[15][15]).toBe(MakeCodeColor.RED);
  });

  test("pasteSpriteData draws every pixel of the sprite onto the canvas", () => {
    const { result, fake } = setup();
    fake.calls.length = 0;
    act(() =>
      result.current.paste.pasteSpriteData(grid(16, 16, MakeCodeColor.BLUE))
    );
    const fillRects = fake.calls.filter((c) => c[0] === "fillRect");
    // 16x16 non-transparent pixels => at least 256 fillRect calls.
    expect(fillRects.length).toBeGreaterThanOrEqual(256);
  });

  test("pasteSpriteData is a no-op when no canvas is attached", () => {
    const { result } = renderHookWithProviders(() => {
      const paste = usePasteData();
      const sprite = useSprite();
      return { paste, sprite };
    });
    // canvasRef.current is null -> early return, sprite state stays at default [[]].
    act(() =>
      result.current.paste.pasteSpriteData(grid(16, 16, MakeCodeColor.GREEN))
    );
    expect(result.current.sprite.spriteData).toEqual([[]]);
  });

  test("pasteCanvas converts a source canvas to sprite data and stores it", () => {
    const { result } = setup();
    // Source canvas is fully opaque black-ish (alpha=255, rgb=0) per the fill fn.
    const src = makeFakeCanvas().canvas;
    act(() => result.current.paste.pasteCanvas(src));
    const data = result.current.sprite.spriteData;
    expect(data.length).toBe(16);
    expect(data[0].length).toBe(16);
    // Every cell is a valid MakeCodeColor enum value (a string), never undefined.
    expect(typeof data[0][0]).toBe("string");
  });

  test("pasteCanvas of a fully transparent source yields transparent pixels", () => {
    const { result } = setup();
    // All-zero RGBA => alpha 0 => transparent.
    const transparentSrc = makeFakeCanvas(16, 16, () => 0).canvas;
    act(() => result.current.paste.pasteCanvas(transparentSrc));
    const data = result.current.sprite.spriteData;
    expect(data[0][0]).toBe(MakeCodeColor.TRANSPARENT);
    expect(data[8][8]).toBe(MakeCodeColor.TRANSPARENT);
  });
});
