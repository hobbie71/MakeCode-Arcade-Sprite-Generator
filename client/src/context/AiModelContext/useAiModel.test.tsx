import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AiModelProvider } from "./AiModelContext";
import { useAiModel } from "./useAiModel";
import { AiModel } from "../../types/export";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AiModelProvider>{children}</AiModelProvider>
);

describe("AiModelContext / useAiModel", () => {
  test("defaults to AiModel.GPTImage1", () => {
    const { result } = renderHook(() => useAiModel(), { wrapper });
    expect(result.current.selectedModel).toBe(AiModel.GPTImage1);
  });

  test("setSelectedModel updates the value", () => {
    const { result } = renderHook(() => useAiModel(), { wrapper });
    act(() => result.current.setSelectedModel(AiModel.GPTImage1));
    expect(result.current.selectedModel).toBe(AiModel.GPTImage1);
    // value is the enum's string member
    expect(result.current.selectedModel).toBe("gpt-image-1" as AiModel);
  });

  test("exposes a setter function", () => {
    const { result } = renderHook(() => useAiModel(), { wrapper });
    expect(typeof result.current.setSelectedModel).toBe("function");
  });

  test("throws when used outside <AiModelProvider>", () => {
    expect(() => renderHook(() => useAiModel())).toThrow(
      /must be used within a AiModelProvider/
    );
  });
});
