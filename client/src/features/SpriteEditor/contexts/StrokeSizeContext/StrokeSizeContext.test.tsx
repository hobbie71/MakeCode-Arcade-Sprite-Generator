import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { StrokeSizeProvider } from "./StrokeSizeContext";
import { useStrokeSize } from "./useStrokeSize";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StrokeSizeProvider>{children}</StrokeSizeProvider>
);

describe("StrokeSizeContext / useStrokeSize", () => {
  test("defaults: strokeSize is 1", () => {
    const { result } = renderHook(() => useStrokeSize(), { wrapper });
    expect(result.current.strokeSize).toBe(1);
  });

  test("setStrokeSize updates to another valid stroke size", () => {
    const { result } = renderHook(() => useStrokeSize(), { wrapper });
    act(() => result.current.setStrokeSize(3));
    expect(result.current.strokeSize).toBe(3);
    act(() => result.current.setStrokeSize(5));
    expect(result.current.strokeSize).toBe(5);
  });

  test("setStrokeSize accepts a functional updater", () => {
    const { result } = renderHook(() => useStrokeSize(), { wrapper });
    act(() => result.current.setStrokeSize((prev) => (prev === 1 ? 5 : prev)));
    expect(result.current.strokeSize).toBe(5);
  });

  test("throws when used outside <StrokeSizeProvider>", () => {
    expect(() => renderHook(() => useStrokeSize())).toThrow(
      /must be inside <StrokeSizeProvider>/
    );
  });
});
