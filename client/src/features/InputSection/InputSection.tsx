// Components
import TabButton from "./components/TabButton";
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import Button from "../../components/Button";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";

// Context imports
import { useAssetType } from "@/context/AssetTypeContext/useAssetType";

// Hook imports
import { useImageFileHandler } from "./hooks/useImageFileHandler";

// Type imports
import { AssetType, assetTypes } from "@/types/export";

const InputSection = () => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { generateSpriteFromImportedImage } = useImageFileHandler();

  const handleAssetSelect = (assetType: AssetType) => {
    setSelectedAsset(assetType);
  };

  return (
    <div className="p-2 w-full h-full" style={{ backgroundColor: "#1e1e1e" }}>
      <h1 className="heading-3">ArcadeMake Code Sprite Generator</h1>
      <div className="asset-type-container flex flex-row gap-1 border-b-2 border-b-neutral-700 border-x-0 border-t-0">
        {assetTypes.map((type) => (
          <TabButton
            key={type}
            isSelected={selectedAsset === type}
            onClick={() => handleAssetSelect(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </TabButton>
        ))}
      </div>

      <AssetOptionsSelection selectedAsset={selectedAsset} />
      <PaletteSelection />
      <GenerationMethodSection />

      <Button onClick={generateSpriteFromImportedImage}>Generate Sprite</Button>
    </div>
  );
};

export default InputSection;
