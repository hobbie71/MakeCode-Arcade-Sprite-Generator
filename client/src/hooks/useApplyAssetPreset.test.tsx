import { describe, it, expect } from "bun:test";
import { act, renderHookWithProviders } from "../test/test-utils";
import { AssetType, Crop } from "../types/export";
import { useApplyAssetPreset } from "./useApplyAssetPreset";
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../context/PostProcessingContext/usePostProcessing";

describe("useApplyAssetPreset", () => {
  it("applies the Background preset to canvas size + post-processing", () => {
    const { result } = renderHookWithProviders(() => ({
      apply: useApplyAssetPreset(),
      size: useCanvasSize(),
      pp: usePostProcessing(),
    }));

    act(() => {
      result.current.apply(AssetType.Background);
    });

    expect(result.current.size.width).toBe(160);
    expect(result.current.size.height).toBe(120);
    expect(result.current.pp.settings.removeBackground).toBe(false);
    expect(result.current.pp.settings.crop).toBe(Crop.Fill);
  });

  it("applies the Sprite preset (64×64, remove background)", () => {
    const { result } = renderHookWithProviders(() => ({
      apply: useApplyAssetPreset(),
      size: useCanvasSize(),
      pp: usePostProcessing(),
    }));

    act(() => {
      result.current.apply(AssetType.Sprite);
    });

    expect(result.current.size.width).toBe(64);
    expect(result.current.size.height).toBe(64);
    expect(result.current.pp.settings.removeBackground).toBe(true);
    expect(result.current.pp.settings.crop).toBe(Crop.Edges);
  });
});
