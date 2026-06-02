import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { PostProcessingProvider } from "./PostProcessingContext";
import { usePostProcessing } from "./usePostProcessing";
import { AssetType, Crop } from "../../types/export";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PostProcessingProvider>{children}</PostProcessingProvider>
);

describe("PostProcessingContext / usePostProcessing", () => {
  test("starts with the sprite-style defaults", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    expect(result.current.settings.removeBackground).toBe(true);
    expect(result.current.settings.crop).toBe(Crop.Edges);
    expect(result.current.settings.tolerance).toBe(30);
  });

  test("updateSetting changes a single field", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    act(() => result.current.updateSetting("tolerance", 75));
    expect(result.current.settings.tolerance).toBe(75);
    expect(result.current.settings.removeBackground).toBe(true);
  });

  test("updateSetting can toggle removeBackground and crop", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    act(() => result.current.updateSetting("removeBackground", false));
    act(() => result.current.updateSetting("crop", Crop.Fill));
    expect(result.current.settings.removeBackground).toBe(false);
    expect(result.current.settings.crop).toBe(Crop.Fill);
  });

  test("resetToDefaults for Sprite restores edges + removeBackground", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    act(() => result.current.updateSetting("crop", Crop.None));
    act(() => result.current.updateSetting("removeBackground", false));
    act(() => result.current.resetToDefaults(AssetType.Sprite));
    expect(result.current.settings.crop).toBe(Crop.Edges);
    expect(result.current.settings.removeBackground).toBe(true);
    expect(result.current.settings.tolerance).toBe(30);
  });

  test("resetToDefaults for Background uses fill crop and no background removal", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    act(() => result.current.resetToDefaults(AssetType.Background));
    expect(result.current.settings.crop).toBe(Crop.Fill);
    expect(result.current.settings.removeBackground).toBe(false);
  });

  test("resetToDefaults for Tile keeps edges crop but disables background removal", () => {
    const { result } = renderHook(() => usePostProcessing(), { wrapper });
    act(() => result.current.resetToDefaults(AssetType.Tile));
    expect(result.current.settings.crop).toBe(Crop.Edges);
    expect(result.current.settings.removeBackground).toBe(false);
  });

  test("throws when used outside a PostProcessingProvider", () => {
    expect(() => renderHook(() => usePostProcessing())).toThrow(
      /must be used within a PostProcessingProvider/,
    );
  });
});
