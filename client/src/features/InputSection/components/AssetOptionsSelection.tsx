// Component imports
import SizeInputs from "./SizeInputs";
import TabButton from "./TabButton";

// Context imports
import { useAssetType } from "../../../context/AssetTypeContext/useAssetType";
import { useLoading } from "../../../context/LoadingContext/useLoading";

// Type imports
import { AssetType, ALL_ASSETS_TYPE } from "../../../types/export";
import { BACKGROUND_SIZE, TILE_SIZE } from "../../../types/pixel";

const AssetOptionsSelection = () => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { isGenerating } = useLoading();

  const handleAssetSelect = (assetType: AssetType) => {
    if (isGenerating) return;
    setSelectedAsset(assetType);
  };

  return (
    <>
      <div className="tab-list">
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
        <div className="form-group">
          <h5 className="heading-5">Sprite Size (px)</h5>
          <SizeInputs disabled={isGenerating} />
        </div>
      )}

      {selectedAsset === AssetType.Background && (
        <div className="form-group">
          <h5 className="heading-5">Background Size (px)</h5>
          <SizeInputs fixedSize={BACKGROUND_SIZE} disabled={isGenerating} />
        </div>
      )}

      {selectedAsset === AssetType.Tile && (
        <div className="form-group">
          <h5 className="heading-5">Tile Size (px)</h5>
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
