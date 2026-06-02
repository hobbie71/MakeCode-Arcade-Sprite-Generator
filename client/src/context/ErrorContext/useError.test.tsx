import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ErrorProvider } from "./ErrorContext";
import { useError } from "./useError";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ErrorProvider>{children}</ErrorProvider>
);

describe("ErrorContext / useError", () => {
  test("starts with no error", () => {
    const { result } = renderHook(() => useError(), { wrapper });
    expect(result.current.error).toBeNull();
  });

  test("setError updates the value", () => {
    const { result } = renderHook(() => useError(), { wrapper });
    act(() => result.current.setError("boom"));
    expect(result.current.error).toBe("boom");
    act(() => result.current.setError(null));
    expect(result.current.error).toBeNull();
  });

  test("throws when used outside <ErrorProvider>", () => {
    expect(() => renderHook(() => useError())).toThrow(/must be inside <ErrorProvider>/);
  });
});
