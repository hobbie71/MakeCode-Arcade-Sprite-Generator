import { useCallback, useEffect } from "react";

// Component imports
import AiPromptInput from "../components/AiPromptInput";
import DefaultDropDown from "../../../../../components/DefaultDropDown";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useAssetType } from "../../../../../context/AssetTypeContext/useAssetType";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

// Type imports
import { ALL_OPENAI_QUALITYS } from "../../../../../types/export";

interface Props {
  /** When false, hides the Quality picker. The hero entry widget passes false to
   *  keep the home-page form minimal; the Studio Generate modal leaves it visible. */
  showQuality?: boolean;
}

/** Quality options annotated with their display-only token cost as a subtitle
 *  (e.g. "High" → "3 tokens"), so the premium is visible while choosing. */
const QUALITY_OPTIONS = ALL_OPENAI_QUALITYS.map((quality) => ({
  ...quality,
  description: `${quality.tokenCost} token${quality.tokenCost === 1 ? "" : "s"}`,
}));

const OpenAISettingsSection = ({ showQuality = true }: Props) => {
  const { selectedAsset } = useAssetType();
  const { settings, updateSetting, resetToDefaults } = useOpenAISettings();
  const { isGenerating } = useLoading();

  // Reset settings when asset type changes
  useEffect(() => {
    resetToDefaults(selectedAsset);
  }, [selectedAsset, resetToDefaults]);

  const changeSetting = useCallback(
    <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
      updateSetting(key, value);
    },
    [updateSetting]
  );

  return (
    <div className="form-group">
      <AiPromptInput
        onSubmit={(prompt) => changeSetting("prompt", prompt)}
        disabled={isGenerating}
      />

      {showQuality && (
        <DefaultDropDown
          onChange={(index: number) =>
            changeSetting("quality", QUALITY_OPTIONS[index].quality)
          }
          options={QUALITY_OPTIONS}
          value={QUALITY_OPTIONS.findIndex(
            (quality) => settings.quality === quality.quality
          )}
          disabled={isGenerating}>
          Quality
        </DefaultDropDown>
      )}
    </div>
  );
};

export default OpenAISettingsSection;
