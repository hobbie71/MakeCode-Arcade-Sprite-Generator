// Component imports
import SizeInputs from "./SizeInputs";

// Type imports
import { AssetType } from "@/types/export";
import { BACKGROUND_SIZE, TILE_SIZE } from "@/types/pixel";

interface Props {
  selectedAsset: AssetType;
}

const AssetOptionsSelection = ({ selectedAsset }: Props) => {
  return (
    <>
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
    </>
  );
};

export default AssetOptionsSelection;
