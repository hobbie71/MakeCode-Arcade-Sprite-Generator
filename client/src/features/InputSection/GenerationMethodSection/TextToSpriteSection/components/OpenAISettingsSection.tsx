import { useState } from "react";

// Component imports
import AiPromptInput from "../components/AiPromptInput";
import DefaultDropDown from "../../../../../components/DefaultDropDown";
import AdvanceDropDownButton from "./AdvanceDropDownButton";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useAssetType } from "../../../../../context/AssetTypeContext/useAssetType";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

// Type imports
import { ALL_STYLES, ALL_OPENAI_QUALITYS } from "../../../../../types/export";
import { useCallback, useEffect } from "react";

const OpenAISettingsSection = () => {
  const { selectedAsset } = useAssetType();
  const { settings, updateSetting, resetToDefaults } = useOpenAISettings();
  const { isGenerating } = useLoading();

  const [isAdvanceTabOpen, setIsAdvanceTabOpen] = useState<boolean>(false);

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
      {/* Style */}
      <DefaultDropDown
        onChange={(index: number) =>
          changeSetting("style", ALL_STYLES[index].style)
        }
        options={ALL_STYLES}
        value={ALL_STYLES.findIndex((style) => settings.style === style.style)}
        disabled={isGenerating}>
        Style
      </DefaultDropDown>

      <AiPromptInput
        onSubmit={(prompt) => changeSetting("prompt", prompt)}
        disabled={isGenerating}
      />

      <AdvanceDropDownButton
        isAdvanceTabOpen={isAdvanceTabOpen}
        setIsAdvanceTabOpen={setIsAdvanceTabOpen}
        isGenerating={isGenerating}
      />

      {isAdvanceTabOpen && (
        <>
          {/* Quality */}
          <DefaultDropDown
            onChange={(index: number) =>
              changeSetting("quality", ALL_OPENAI_QUALITYS[index].quality)
            }
            options={ALL_OPENAI_QUALITYS}
            value={ALL_OPENAI_QUALITYS.findIndex(
              (quality) => settings.quality === quality.quality
            )}
            disabled={isGenerating}>
            Quality
          </DefaultDropDown>
        </>
      )}
    </div>
  );
};

export default OpenAISettingsSection;
