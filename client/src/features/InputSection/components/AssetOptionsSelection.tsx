// Component imports
import SizeInputs from "./SizeInputs";
import TabButton from "./TabButton";

// Context imports
import { useAssetType } from "@/context/AssetTypeContext/useAssetType";
import { useLoading } from "@/context/LoadingContext/useLoading";

// Type imports
import { AssetType, ALL_ASSETS_TYPE } from "@/types/export";
import { BACKGROUND_SIZE, TILE_SIZE } from "@/types/pixel";

const AssetOptionsSelection = () => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { isGenerating } = useLoading();

  const handleAssetSelect = (assetType: AssetType) => {
    if (isGenerating) return;
    setSelectedAsset(assetType);
  };

  return (
    <>
      <div className="asset-type-container flex flex-row gap-1 border-b-2 border-b-neutral-700 border-x-0 border-t-0">
        {ALL_ASSETS_TYPE.map((type) => (
          <TabButton
            key={type}
            isSelected={selectedAsset === type}
            onClick={() => handleAssetSelect(type)}
            disabled={isGenerating}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </TabButton>
        ))}
      </div>

      {selectedAsset === AssetType.Sprite && (
        <>
          <h3 className="heading-3">Sprite Size (px)</h3>
          <SizeInputs disabled={isGenerating} />
        </>
      )}

      {selectedAsset === AssetType.Background && (
        <div className="background-options">
          <h3 className="heading-3">Background Size (px)</h3>
          <SizeInputs fixedSize={BACKGROUND_SIZE} disabled={isGenerating} />
        </div>
      )}

      {selectedAsset === AssetType.Tile && (
        <div className="tile-options">
          <h3 className="heading-3">Tile Size (px)</h3>
          <SizeInputs fixedSize={TILE_SIZE} disabled={isGenerating} />
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
    </>
  );
};

export default AssetOptionsSelection;
