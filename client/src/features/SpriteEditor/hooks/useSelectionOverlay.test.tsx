import { test, expect, describe } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { useSelectionOverlay } from "./useSelectionOverlay";
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../types/color";

// Drive the overlay hook alongside the selection-area context so we can read
// the resulting SelectionArea state after each call. setEndOverlay reads the
// sprite grid (getSelectedSpriteData), so we seed a real 16x16 grid first.
function setup() {
  const { result } = renderHookWithProviders(() => {
    const overlay = useSelectionOverlay();
    const area = useSelectionArea();
    const sprite = useSprite();
    return { overlay, area, sprite };
  });
  act(() => {
    const grid = Array.from({ length: 16 }, () =>
      Array(16).fill(MakeCodeColor.TRANSPARENT)
    );
    result.current.sprite.setSpriteData(grid);
  });
  return result;
}

describe("useSelectionOverlay", () => {
  test("exposes its three callbacks", () => {
    const result = setup();
    expect(typeof result.current.overlay.setStartOverlay).toBe("function");
    expect(typeof result.current.overlay.setEndOverlay).toBe("function");
    expect(typeof result.current.overlay.resetSelectionAreaIfOutOfArea).toBe(
      "function"
    );
  });

  test("setStartOverlay seeds start and end from a single point when no area exists", () => {
    const result = setup();
    expect(result.current.area.selectionArea).toBeNull();
    act(() => result.current.overlay.setStartOverlay({ x: 3, y: 4 }));
    expect(result.current.area.selectionArea).toEqual({
      start: { x: 3, y: 4 },
      end: { x: 3, y: 4 },
    });
  });

  test("setStartOverlay only replaces start when an area already exists", () => {
    const result = setup();
    act(() => result.current.overlay.setStartOverlay({ x: 1, y: 1 }));
    act(() => result.current.overlay.setEndOverlay({ x: 5, y: 6 }));
    act(() => result.current.overlay.setStartOverlay({ x: 2, y: 2 }));
    expect(result.current.area.selectionArea).toEqual({
      start: { x: 2, y: 2 },
      end: { x: 5, y: 6 },
    });
  });

  test("setEndOverlay updates the end coordinate of an existing area", () => {
    const result = setup();
    act(() => result.current.overlay.setStartOverlay({ x: 0, y: 0 }));
    act(() => result.current.overlay.setEndOverlay({ x: 7, y: 8 }));
    expect(result.current.area.selectionArea).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 7, y: 8 },
    });
  });

  test("setEndOverlay is a no-op when the end coordinate is unchanged", () => {
    const result = setup();
    act(() => result.current.overlay.setStartOverlay({ x: 0, y: 0 }));
    // start seeds end={0,0}; calling setEndOverlay with the same point bails early.
    act(() => result.current.overlay.setEndOverlay({ x: 0, y: 0 }));
    expect(result.current.area.selectionArea).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    });
  });

  test("setEndOverlay without a prior start leaves the area null", () => {
    const result = setup();
    // No start set yet -> selectionArea is null -> functional updater returns null.
    act(() => result.current.overlay.setEndOverlay({ x: 4, y: 4 }));
    expect(result.current.area.selectionArea).toBeNull();
  });

  test("resetSelectionAreaIfOutOfArea does not throw with or without an area", () => {
    const result = setup();
    expect(() =>
      act(() => result.current.overlay.resetSelectionAreaIfOutOfArea())
    ).not.toThrow();
    act(() => result.current.overlay.setStartOverlay({ x: 2, y: 2 }));
    expect(() =>
      act(() => result.current.overlay.resetSelectionAreaIfOutOfArea())
    ).not.toThrow();
  });
});
