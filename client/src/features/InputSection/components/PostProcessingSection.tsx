import { useEffect } from "react";

// Component imports
import CheckBox from "./CheckBox";
import NumberInputBox from "./NumberInputBox";
import DefaultDropDown from "../../../components/DefaultDropDown";

// Hooks imports
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import { useAssetType } from "../../../context/AssetTypeContext/useAssetType";

// Type imports
import { ALL_CROP_OPTIONS } from "../../../types/export";

const PostProcessingSection = () => {
  const { selectedAsset } = useAssetType();
  const { settings, updateSetting, resetToDefaults } = usePostProcessing();
  const { isGenerating } = useLoading();

  // Reset settings when asset type changes
  useEffect(() => {
    resetToDefaults(selectedAsset);
  }, [selectedAsset, resetToDefaults]);

  return (
    <div className="">
      <h4 className="heading-4">Image Processing</h4>

      {/* Remove Background */}
      <CheckBox
        onChange={(bool: boolean) => updateSetting("removeBackground", bool)}
        checked={settings.removeBackground}
        disabled={isGenerating}>
        Remove Background
      </CheckBox>

      {/* Tolerance if removing background */}
      {settings.removeBackground && (
        <NumberInputBox
          label="Tolerance"
          onChange={(num: number) => updateSetting("tolerance", num)}
          value={settings.tolerance}
          min={1}
          max={100}
          maxDigits={3}
          disabled={isGenerating}
        />
      )}

      {/* Crop Settings */}
      <DefaultDropDown
        onChange={(index: number) =>
          updateSetting("crop", ALL_CROP_OPTIONS[index].option)
        }
        options={ALL_CROP_OPTIONS}
        value={ALL_CROP_OPTIONS.findIndex(
          (cropOption) => settings.crop === cropOption.option
        )}
        disabled={isGenerating}>
        Crop Options
      </DefaultDropDown>
    </div>
  );
};

export default PostProcessingSection;
