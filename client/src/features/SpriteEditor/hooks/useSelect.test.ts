import { test, expect, describe } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useSelect } from "./useSelect";

// useSelect is currently a stubbed tool hook: it exports a runtime function
// whose body is fully commented out, so it returns `undefined`. These tests
// pin that contract (no throw, returns undefined) so a future implementation
// is a deliberate, visible change.
describe("useSelect", () => {
  test("is a callable hook", () => {
    expect(typeof useSelect).toBe("function");
  });

  test("renders without throwing and returns undefined", () => {
    const { result } = renderHook(() => useSelect());
    expect(result.current).toBeUndefined();
  });
});
