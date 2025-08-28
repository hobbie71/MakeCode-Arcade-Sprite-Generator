// Component imports
import CheckBox from "@/features/InputSection/components/CheckBox";
import NumberInputBox from "../../../components/NumberInputBox";

// Hooks imports
import { usePostProcessing } from "@/context/PostProcessingContext/usePostProcessing";
import { useLoading } from "@/context/LoadingContext/useLoading";
import { useAssetType } from "@/context/AssetTypeContext/useAssetType";
import { useEffect } from "react";

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
      {/* Crop Edges */}
      <CheckBox
        onChange={(bool: boolean) => updateSetting("cropEdges", bool)}
        checked={settings.cropEdges}
        disabled={isGenerating}>
        Crop Edges
      </CheckBox>

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
    </div>
  );
};

export default PostProcessingSection;
