import { test, expect, describe, afterEach } from "bun:test";
import { renderHook, act, fireEvent } from "@testing-library/react";
import { useSidebar } from "./useSidebar";

afterEach(() => {
  // Defensive: make sure no test leaks a locked body onto the next one.
  document.body.style.overflow = "";
  document.body.style.height = "";
});

describe("useSidebar", () => {
  test("starts closed", () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.isOpen).toBe(false);
  });

  test("open() sets isOpen true and locks body scroll", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.height).toBe("100vh");
  });

  test("close() sets isOpen false and unlocks body scroll", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.height).toBe("");
  });

  test("toggle() flips isOpen back and forth", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  test("Escape key closes an open sidebar", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(result.current.isOpen).toBe(false);
  });

  test("Escape key is a no-op when the sidebar is already closed", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(result.current.isOpen).toBe(false);
  });

  test("a non-Escape key does not close an open sidebar", () => {
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.open());
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    expect(result.current.isOpen).toBe(true);
  });

  test("unmount restores body scroll", () => {
    const { result, unmount } = renderHook(() => useSidebar());
    act(() => result.current.open());
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.height).toBe("");
  });

  test("the action callbacks are stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useSidebar());
    const first = {
      open: result.current.open,
      close: result.current.close,
      toggle: result.current.toggle,
    };
    rerender();
    expect(result.current.open).toBe(first.open);
    expect(result.current.close).toBe(first.close);
    expect(result.current.toggle).toBe(first.toggle);
  });
});
