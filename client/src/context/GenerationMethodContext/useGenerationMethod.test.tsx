import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { GenerationMethodProvider } from "./GenerationMethodContext";
import { useGenerationMethod } from "./useGenerationMethod";
import { GenerationMethod } from "../../types/export";

const wrapper = ({ children }: { children: ReactNode }) => (
  <GenerationMethodProvider>{children}</GenerationMethodProvider>
);

describe("GenerationMethodContext / useGenerationMethod", () => {
  test("defaults to GenerationMethod.TextToSprite", () => {
    const { result } = renderHook(() => useGenerationMethod(), { wrapper });
    expect(result.current.selectedMethod).toBe(GenerationMethod.TextToSprite);
  });

  test("setSelectedMethod updates the value", () => {
    const { result } = renderHook(() => useGenerationMethod(), { wrapper });
    act(() => result.current.setSelectedMethod(GenerationMethod.ImageToSprite));
    expect(result.current.selectedMethod).toBe(GenerationMethod.ImageToSprite);
    act(() => result.current.setSelectedMethod(GenerationMethod.TextToSprite));
    expect(result.current.selectedMethod).toBe(GenerationMethod.TextToSprite);
  });

  test("throws when used outside <GenerationMethodProvider>", () => {
    expect(() => renderHook(() => useGenerationMethod())).toThrow(
      /must be used within a GenerationMethodProvider/
    );
  });
});
