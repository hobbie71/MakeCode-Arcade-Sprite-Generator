import { test, expect, describe, mock } from "bun:test";
import { renderHookWithProviders, act } from "../../../test/test-utils";
import { usePan } from "./usePan";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";
import type { Coordinates } from "../../../types/pixel";

// Build a minimal fake React.MouseEvent<HTMLDivElement> carrying clientX/clientY
// and a currentTarget whose style.cursor we can read/mutate.
function makeMouseEvent(clientX: number, clientY: number, cursor = "grab") {
  const style = { cursor };
  return {
    clientX,
    clientY,
    currentTarget: { style },
  } as unknown as React.MouseEvent<HTMLDivElement>;
}

// Drive usePan together with the tool context so we can flip the active tool.
function setup(initialOffset: Coordinates = { x: 0, y: 0 }) {
  const setOffset = mock((o: Coordinates) => {
    state.offset = o;
  });
  const state = { offset: initialOffset };
  const { result } = renderHookWithProviders(() => {
    const tool = useToolSelected();
    const pan = usePan(state.offset, setOffset);
    return { tool, pan };
  });
  return { result, setOffset, state };
}

describe("usePan", () => {
  test("returns the four pointer handlers", () => {
    const { result } = setup();
    expect(typeof result.current.pan.handlePointerDown).toBe("function");
    expect(typeof result.current.pan.handlePointerMove).toBe("function");
    expect(typeof result.current.pan.handlePointerUp).toBe("function");
    expect(typeof result.current.pan.handlePointerLeave).toBe("function");
  });

  test("does nothing while the active tool is not Pan", () => {
    // Default tool is Pencil.
    const { result, setOffset } = setup();
    act(() => result.current.pan.handlePointerDown(makeMouseEvent(10, 10)));
    act(() => result.current.pan.handlePointerMove(makeMouseEvent(40, 30)));
    expect(setOffset).not.toHaveBeenCalled();
  });

  test("pans by the pointer delta added to the current offset", () => {
    const { result, setOffset } = setup({ x: 100, y: 50 });
    act(() => result.current.tool.setTool(EditorTools.Pan));
    // Establish an anchor point.
    act(() => result.current.pan.handlePointerDown(makeMouseEvent(10, 10)));
    // Move by +25 in x, +5 in y.
    act(() => result.current.pan.handlePointerMove(makeMouseEvent(35, 15)));
    expect(setOffset).toHaveBeenCalledTimes(1);
    expect(setOffset.mock.calls[0][0]).toEqual({ x: 125, y: 55 });
  });

  test("ignores moves before a pointer-down (no anchor yet)", () => {
    const { result, setOffset } = setup({ x: 0, y: 0 });
    act(() => result.current.tool.setTool(EditorTools.Pan));
    // No handlePointerDown -> isMouseDown stays false -> move is a no-op.
    act(() => result.current.pan.handlePointerMove(makeMouseEvent(35, 15)));
    expect(setOffset).not.toHaveBeenCalled();
  });

  test("stops panning after pointer up", () => {
    const { result, setOffset } = setup({ x: 0, y: 0 });
    act(() => result.current.tool.setTool(EditorTools.Pan));
    act(() => result.current.pan.handlePointerDown(makeMouseEvent(0, 0)));
    act(() => result.current.pan.handlePointerUp(makeMouseEvent(0, 0)));
    setOffset.mockClear();
    act(() => result.current.pan.handlePointerMove(makeMouseEvent(20, 20)));
    expect(setOffset).not.toHaveBeenCalled();
  });

  test("pointer-down sets cursor from grab to grabbing", () => {
    const { result } = setup();
    act(() => result.current.tool.setTool(EditorTools.Pan));
    const ev = makeMouseEvent(0, 0, "grab");
    act(() => result.current.pan.handlePointerDown(ev));
    expect(ev.currentTarget.style.cursor).toBe("grabbing");
  });

  test("pointer-up resets cursor from grabbing back to grab", () => {
    const { result } = setup();
    act(() => result.current.tool.setTool(EditorTools.Pan));
    const ev = makeMouseEvent(0, 0, "grabbing");
    act(() => result.current.pan.handlePointerUp(ev));
    expect(ev.currentTarget.style.cursor).toBe("grab");
  });

  test("pointer-leave resets cursor and disables panning", () => {
    const { result, setOffset } = setup({ x: 0, y: 0 });
    act(() => result.current.tool.setTool(EditorTools.Pan));
    act(() => result.current.pan.handlePointerDown(makeMouseEvent(0, 0)));
    const leave = makeMouseEvent(0, 0, "grabbing");
    act(() => result.current.pan.handlePointerLeave(leave));
    expect(leave.currentTarget.style.cursor).toBe("grab");
    // After leaving, further moves are ignored.
    act(() => result.current.pan.handlePointerMove(makeMouseEvent(50, 50)));
    expect(setOffset).not.toHaveBeenCalled();
  });
});
