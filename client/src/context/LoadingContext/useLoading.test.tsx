import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { LoadingProvider } from "./LoadingContext";
import { useLoading } from "./useLoading";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LoadingProvider>{children}</LoadingProvider>
);

describe("LoadingContext / useLoading", () => {
  test("defaults to not generating with empty message", () => {
    const { result } = renderHook(() => useLoading(), { wrapper });
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generationMessage).toBe("");
  });

  test("setIsGenerating and setGenerationMessage update values directly", () => {
    const { result } = renderHook(() => useLoading(), { wrapper });
    act(() => {
      result.current.setIsGenerating(true);
      result.current.setGenerationMessage("hello");
    });
    expect(result.current.isGenerating).toBe(true);
    expect(result.current.generationMessage).toBe("hello");
  });

  test("startGeneration sets generating with the default message", () => {
    const { result } = renderHook(() => useLoading(), { wrapper });
    act(() => result.current.startGeneration());
    expect(result.current.isGenerating).toBe(true);
    expect(result.current.generationMessage).toBe("Generating sprite...");
  });

  test("startGeneration accepts a custom message", () => {
    const { result } = renderHook(() => useLoading(), { wrapper });
    act(() => result.current.startGeneration("Cooking pixels"));
    expect(result.current.isGenerating).toBe(true);
    expect(result.current.generationMessage).toBe("Cooking pixels");
  });

  test("stopGeneration clears generating state and message", () => {
    const { result } = renderHook(() => useLoading(), { wrapper });
    act(() => result.current.startGeneration("busy"));
    expect(result.current.isGenerating).toBe(true);
    act(() => result.current.stopGeneration());
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generationMessage).toBe("");
  });

  test("throws when used outside <LoadingProvider>", () => {
    expect(() => renderHook(() => useLoading())).toThrow(
      /must be used within a LoadingProvider/
    );
  });
});
