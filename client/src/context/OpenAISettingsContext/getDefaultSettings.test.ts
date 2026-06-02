import { test, expect, describe } from "bun:test";
import { AssetType, OpenAIQuality, Style } from "../../types/export";
import { getDefaultOpenAISettings } from "./getDefaultSettings";

describe("getDefaultOpenAISettings", () => {
  test("Sprite defaults: empty prompt, Retro style, Low quality", () => {
    const settings = getDefaultOpenAISettings(AssetType.Sprite);
    expect(settings).toEqual({
      prompt: "",
      assetType: AssetType.Sprite,
      style: Style.Retro,
      quality: OpenAIQuality.Low,
    });
  });

  test("Tile defaults stay at Low quality", () => {
    const settings = getDefaultOpenAISettings(AssetType.Tile);
    expect(settings.assetType).toBe(AssetType.Tile);
    expect(settings.quality).toBe(OpenAIQuality.Low);
    expect(settings.style).toBe(Style.Retro);
  });

  test("Background bumps quality to Medium", () => {
    const settings = getDefaultOpenAISettings(AssetType.Background);
    expect(settings.assetType).toBe(AssetType.Background);
    expect(settings.quality).toBe(OpenAIQuality.Medium);
    expect(settings.style).toBe(Style.Retro);
  });

  test("preservePrompt carries the prior prompt text through", () => {
    const settings = getDefaultOpenAISettings(
      AssetType.Sprite,
      "a red dragon"
    );
    expect(settings.prompt).toBe("a red dragon");
  });

  test("empty/undefined preservePrompt falls back to empty string", () => {
    expect(getDefaultOpenAISettings(AssetType.Sprite, "").prompt).toBe("");
    expect(getDefaultOpenAISettings(AssetType.Sprite).prompt).toBe("");
  });

  test("preservePrompt is honoured for Background too", () => {
    const settings = getDefaultOpenAISettings(AssetType.Background, "forest");
    expect(settings.prompt).toBe("forest");
    expect(settings.quality).toBe(OpenAIQuality.Medium);
  });
});
