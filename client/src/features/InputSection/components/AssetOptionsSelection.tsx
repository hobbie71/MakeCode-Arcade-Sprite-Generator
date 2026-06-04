// Component imports
import SizeInputs from "./SizeInputs";
import DefaultDropDown from "../../../components/DefaultDropDown";

// Context imports
import { useAssetType } from "../../../context/AssetTypeContext/useAssetType";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useLoading } from "../../../context/LoadingContext/useLoading";

// Type imports
import { AssetType, ALL_ASSETS_TYPE } from "../../../types/export";
import { BACKGROUND_SIZE, TILE_SIZE } from "../../../types/pixel";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ASSET_OPTIONS = ALL_ASSETS_TYPE.map((type) => ({ name: cap(type), type }));

// Most common square sprite sizes, surfaced as one-tap presets beneath the
// Width/Height inputs (keeps arbitrary sizing, adds quick access to the usual ones).
const COMMON_SIZES = [8, 16, 24, 32, 48, 64];

const AssetOptionsSelection = () => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { width, height, setWidth, setHeight } = useCanvasSize();
  const { isGenerating } = useLoading();

  const applyPreset = (n: number) => {
    if (isGenerating) return;
    setWidth(n);
    setHeight(n);
  };

  return (
    <>
      {/* Asset type — dropdown (matches mockup) */}
      <DefaultDropDown
        options={ASSET_OPTIONS}
        value={ALL_ASSETS_TYPE.indexOf(selectedAsset)}
        onChange={(index) => {
          if (!isGenerating) setSelectedAsset(ALL_ASSETS_TYPE[index]);
        }}
        disabled={isGenerating}>
        Asset type
      </DefaultDropDown>

      {selectedAsset === AssetType.Sprite && (
        <div className="form-group">
          <h5 className="heading-5">Sprite Size (px)</h5>
          <SizeInputs disabled={isGenerating} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_SIZES.map((n) => {
              const active = width === n && height === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => applyPreset(n)}
                  aria-pressed={active}
                  className={`rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                    active
                      ? "border-accent bg-accent text-on-accent"
                      : "border-line text-ink-muted hover:border-ink-muted hover:text-ink"
                  }`}>
                  {n}×{n}
                </button>
              );
            })}
          </div>
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
    </>
  );
};

export default AssetOptionsSelection;
