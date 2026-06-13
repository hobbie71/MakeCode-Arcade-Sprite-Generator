import { AssetType } from "../../types/export";
import type { OpenAIGenerationSettings } from "../../types/export";

// Default OpenAI settings based on asset type
export const getDefaultOpenAISettings = (
  assetType: AssetType,
  preservePrompt?: string
): OpenAIGenerationSettings => {
  const settings: OpenAIGenerationSettings = {
    prompt: preservePrompt || "",
    assetType,
  };

  return settings;
};
