// Components
import SizeInputs from "./components/SizeInputs";
import TabButton from "./components/TabButton";
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import Button from "../../components/Button";

// Context imports
import { useAssetType } from "@/context/AssetTypeContext/useAssetType";

// Hook imports
import { useImageFileHandler } from "./hooks/useImageFileHandler";

// Type imports
import { AssetType, assetTypes } from "@/types/export";
import { BACKGROUND_SIZE, TILE_SIZE } from "@/types/pixel";

const InputSection = () => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { generateSpriteFromImportedImage } = useImageFileHandler();

  const handleAssetSelect = (assetType: AssetType) => {
    setSelectedAsset(assetType);
  };

  return (
    <div
      className="input-section-container p-2"
      style={{ backgroundColor: "#1e1e1e" }}>
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

      {/* Conditional sections based on selected asset */}
      {selectedAsset === AssetType.Sprite && (
        <>
          <h3 className="heading-3">Sprite Size (px)</h3>
          <SizeInputs />
        </>
      )}

      {selectedAsset === AssetType.Background && (
        <div className="background-options">
          <h3 className="heading-3">Background Size (px)</h3>
          <SizeInputs fixedSize={BACKGROUND_SIZE} />
        </div>
      )}

      {selectedAsset === AssetType.Tile && (
        <div className="tile-options">
          <h3 className="heading-3">Tile Size (px)</h3>
          <SizeInputs fixedSize={TILE_SIZE} />
        </div>
      )}

      {selectedAsset === AssetType.Tilemap && (
        <div className="tilemap-options">
          <h3 className="heading-3">Tilemap Size</h3>
          <p className="paragraph text-white/80">Coming soon...</p>
        </div>
      )}

      {selectedAsset === AssetType.Animation && (
        <div className="animation-options">
          <h3 className="heading-3">Animation Sprite Size (px)</h3>
          <p className="paragraph text-white/80">Coming soon...</p>
        </div>
      )}

      <GenerationMethodSection />

      <Button onClick={generateSpriteFromImportedImage}>Generate Sprite</Button>
    </div>
  );
};

export default InputSection;
