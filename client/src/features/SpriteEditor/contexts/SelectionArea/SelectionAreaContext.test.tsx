import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { SelectionAreaProvider } from "./SelectionAreaContext";
import { useSelectionArea } from "./useSelectionArea";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SelectionAreaProvider>{children}</SelectionAreaProvider>
);

describe("SelectionAreaContext / useSelectionArea", () => {
  test("defaults: selectionArea is null", () => {
    const { result } = renderHook(() => useSelectionArea(), { wrapper });
    expect(result.current.selectionArea).toBeNull();
  });

  test("setSelectionArea updates the selection area", () => {
    const { result } = renderHook(() => useSelectionArea(), { wrapper });
    const area = { start: { x: 0, y: 0 }, end: { x: 5, y: 5 } };
    act(() => result.current.setSelectionArea(area));
    expect(result.current.selectionArea).toEqual(area);
  });

  test("setSelectionArea can clear back to null", () => {
    const { result } = renderHook(() => useSelectionArea(), { wrapper });
    act(() =>
      result.current.setSelectionArea({
        start: { x: 1, y: 2 },
        end: { x: 3, y: 4 },
      })
    );
    expect(result.current.selectionArea).not.toBeNull();
    act(() => result.current.setSelectionArea(null));
    expect(result.current.selectionArea).toBeNull();
  });

  test("setSelectionArea accepts a functional updater", () => {
    const { result } = renderHook(() => useSelectionArea(), { wrapper });
    act(() =>
      result.current.setSelectionArea({
        start: { x: 0, y: 0 },
        end: { x: 2, y: 2 },
      })
    );
    act(() =>
      result.current.setSelectionArea((prev) =>
        prev ? { start: prev.start, end: { x: 8, y: 8 } } : null
      )
    );
    expect(result.current.selectionArea).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 8, y: 8 },
    });
  });

  test("throws when used outside <SelectionAreaProvider>", () => {
    expect(() => renderHook(() => useSelectionArea())).toThrow(
      /must be inside <SelectionAreaProvider>/
    );
  });
});
