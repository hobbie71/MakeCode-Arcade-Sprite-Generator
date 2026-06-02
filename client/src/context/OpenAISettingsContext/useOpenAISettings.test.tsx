import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { OpenAISettingsProvider } from "./OpenAISettingsContext";
import { useOpenAISettings } from "./useOpenAISettings";
import { AssetType, OpenAIQuality, Style } from "../../types/export";

const wrapper = ({ children }: { children: ReactNode }) => (
  <OpenAISettingsProvider>{children}</OpenAISettingsProvider>
);

const wrapperFor =
  (initialAssetType: AssetType) =>
  ({ children }: { children: ReactNode }) => (
    <OpenAISettingsProvider initialAssetType={initialAssetType}>
      {children}
    </OpenAISettingsProvider>
  );

describe("OpenAISettingsContext / useOpenAISettings", () => {
  test("defaults to Sprite asset settings (low quality, retro, empty prompt)", () => {
    const { result } = renderHook(() => useOpenAISettings(), { wrapper });
    expect(result.current.settings.assetType).toBe(AssetType.Sprite);
    expect(result.current.settings.quality).toBe(OpenAIQuality.Low);
    expect(result.current.settings.style).toBe(Style.Retro);
    expect(result.current.settings.prompt).toBe("");
  });

  test("respects initialAssetType (Background -> medium quality)", () => {
    const { result } = renderHook(() => useOpenAISettings(), {
      wrapper: wrapperFor(AssetType.Background),
    });
    expect(result.current.settings.assetType).toBe(AssetType.Background);
    expect(result.current.settings.quality).toBe(OpenAIQuality.Medium);
  });

  test("updateSetting changes a single field", () => {
    const { result } = renderHook(() => useOpenAISettings(), { wrapper });
    act(() => result.current.updateSetting("prompt", "a happy cat"));
    expect(result.current.settings.prompt).toBe("a happy cat");
    // other fields unchanged
    expect(result.current.settings.quality).toBe(OpenAIQuality.Low);
  });

  test("updateSetting can change style and quality independently", () => {
    const { result } = renderHook(() => useOpenAISettings(), { wrapper });
    act(() => result.current.updateSetting("style", Style.Anime));
    act(() => result.current.updateSetting("quality", OpenAIQuality.Medium));
    expect(result.current.settings.style).toBe(Style.Anime);
    expect(result.current.settings.quality).toBe(OpenAIQuality.Medium);
  });

  test("resetToDefaults preserves the prompt but restores other defaults", () => {
    const { result } = renderHook(() => useOpenAISettings(), { wrapper });
    act(() => result.current.updateSetting("prompt", "keep me"));
    act(() => result.current.updateSetting("style", Style.Modern));
    act(() => result.current.updateSetting("quality", OpenAIQuality.Medium));
    act(() => result.current.resetToDefaults(AssetType.Sprite));
    expect(result.current.settings.prompt).toBe("keep me");
    expect(result.current.settings.style).toBe(Style.Retro);
    expect(result.current.settings.quality).toBe(OpenAIQuality.Low);
    expect(result.current.settings.assetType).toBe(AssetType.Sprite);
  });

  test("resetToDefaults to Background applies the Background quality default", () => {
    const { result } = renderHook(() => useOpenAISettings(), { wrapper });
    act(() => result.current.resetToDefaults(AssetType.Background));
    expect(result.current.settings.assetType).toBe(AssetType.Background);
    expect(result.current.settings.quality).toBe(OpenAIQuality.Medium);
  });

  test("throws when used outside a OpenAISettingsProvider", () => {
    expect(() => renderHook(() => useOpenAISettings())).toThrow(
      /must be used within a OpenAISettingsProvider/,
    );
  });
});
