import { test, expect, describe, mock } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import { useKeyboardShortcut } from "./useKeyboardShortcut";
import type { KeyboardShortcut } from "./useKeyboardShortcut";

// Dispatches a keydown on `window` (the hook listens on window). Defaults the
// target to document.body so the "skip when typing in an input" guard passes.
const dispatchKeyDown = (
  init: KeyboardEventInit & { target?: EventTarget } = {}
) => {
  const { target, ...eventInit } = init;
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...eventInit,
  });
  if (target) {
    Object.defineProperty(event, "target", { value: target });
    target.dispatchEvent(event);
  } else {
    window.dispatchEvent(event);
  }
  return event;
};

describe("useKeyboardShortcut", () => {
  test("fires the callback for a matching plain key", () => {
    const cb = mock();
    const shortcuts: KeyboardShortcut[] = [{ key: "b", callback: cb }];
    renderHook(() => useKeyboardShortcut(shortcuts));

    act(() => {
      dispatchKeyDown({ key: "b" });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("is case-insensitive on the key", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    act(() => {
      dispatchKeyDown({ key: "B" });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("does not fire for a non-matching key", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    act(() => {
      dispatchKeyDown({ key: "x" });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  test("requires modifiers to match when specified", () => {
    const cb = mock();
    renderHook(() =>
      useKeyboardShortcut([{ key: "s", ctrl: true, callback: cb }])
    );

    // Plain "s" without ctrl must not fire.
    act(() => {
      dispatchKeyDown({ key: "s" });
    });
    expect(cb).not.toHaveBeenCalled();

    // ctrl+s fires.
    act(() => {
      dispatchKeyDown({ key: "s", ctrlKey: true });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("does not fire a plain shortcut when an unexpected modifier is held", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    act(() => {
      dispatchKeyDown({ key: "b", ctrlKey: true });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  test("matches meta/shift/alt combos", () => {
    const cb = mock();
    renderHook(() =>
      useKeyboardShortcut([
        { key: "z", meta: true, shift: true, callback: cb },
      ])
    );
    act(() => {
      dispatchKeyDown({ key: "z", metaKey: true, shiftKey: true });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("calls preventDefault by default", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    let prevented = false;
    act(() => {
      const event = dispatchKeyDown({ key: "b" });
      prevented = event.defaultPrevented;
    });
    expect(prevented).toBe(true);
  });

  test("does not call preventDefault when preventDefault:false", () => {
    const cb = mock();
    renderHook(() =>
      useKeyboardShortcut([{ key: "b", preventDefault: false, callback: cb }])
    );
    let prevented = true;
    act(() => {
      const event = dispatchKeyDown({ key: "b" });
      prevented = event.defaultPrevented;
    });
    expect(prevented).toBe(false);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("ignores keydowns originating from an <input>", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      dispatchKeyDown({ key: "b", target: input });
    });
    expect(cb).not.toHaveBeenCalled();
    input.remove();
  });

  test("ignores keydowns originating from a <textarea>", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }]));
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    act(() => {
      dispatchKeyDown({ key: "b", target: textarea });
    });
    expect(cb).not.toHaveBeenCalled();
    textarea.remove();
  });

  test("does not fire when disabled", () => {
    const cb = mock();
    renderHook(() => useKeyboardShortcut([{ key: "b", callback: cb }], false));
    act(() => {
      dispatchKeyDown({ key: "b" });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  test("stops firing after unmount (listener cleaned up)", () => {
    const cb = mock();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut([{ key: "b", callback: cb }])
    );
    unmount();
    act(() => {
      dispatchKeyDown({ key: "b" });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  test("uses the latest shortcuts after a re-render (no stale closure)", () => {
    const first = mock();
    const second = mock();
    const { rerender } = renderHook(
      ({ shortcuts }) => useKeyboardShortcut(shortcuts),
      { initialProps: { shortcuts: [{ key: "b", callback: first }] } }
    );

    rerender({ shortcuts: [{ key: "b", callback: second }] });

    act(() => {
      dispatchKeyDown({ key: "b" });
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  test("fires multiple matching shortcuts for the same key", () => {
    const a = mock();
    const b = mock();
    renderHook(() =>
      useKeyboardShortcut([
        { key: "g", callback: a },
        { key: "g", callback: b },
      ])
    );
    act(() => {
      dispatchKeyDown({ key: "g" });
    });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
