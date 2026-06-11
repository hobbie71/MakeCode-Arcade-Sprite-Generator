import type { ReactNode } from "react";

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

// Asset-type glyphs — light inline SVGs that inherit `currentColor` (accent
// when the row is selected, muted otherwise), matching the rail icon style.
// Sprite = a little stick figure (a single character/object).
const SpriteIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <circle cx="12" cy="5" r="2.6" strokeWidth={1.6} />
    <path
      d="M12 7.6V14M8 10.8h8M12 14l-3.5 6M12 14l3.5 6"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackgroundIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2.5" strokeWidth={1.6} />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth={1.4} />
  </svg>
);

const TileIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2.5" strokeWidth={1.6} />
    <path d="M12 3v18M3 12h18" strokeWidth={1.5} />
  </svg>
);

// Per-type subtitle + icon shown in the dropdown rows (mirrors the mockup).
// Partial: only the asset types surfaced in ALL_ASSETS_TYPE need an entry.
const ASSET_META: Partial<
  Record<AssetType, { description: string; icon: ReactNode }>
> = {
  [AssetType.Sprite]: {
    description: "A single character or object",
    icon: <SpriteIcon />,
  },
  [AssetType.Background]: {
    description: "160×120 full scene",
    icon: <BackgroundIcon />,
  },
  [AssetType.Tile]: {
    description: "16×16 repeating tile",
    icon: <TileIcon />,
  },
};

const ASSET_OPTIONS = ALL_ASSETS_TYPE.map((type) => ({
  name: cap(type),
  type,
  ...ASSET_META[type],
}));

// Most common square sprite sizes, surfaced as one-tap presets beneath the
// Width/Height inputs (keeps arbitrary sizing, adds quick access to the usual ones).
const COMMON_SIZES = [8, 16, 24, 32, 48, 64];

interface Props {
  /** Quick square-size preset chips (8×8 … 64×64) beneath the Width/Height inputs.
   *  Shown in the Studio Generate modal; hidden in the minimal hero entry widget. */
  showSizePresets?: boolean;
}

const AssetOptionsSelection = ({ showSizePresets = true }: Props) => {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { width, height, setWidth, setHeight } = useCanvasSize();
  const { isGenerating } = useLoading();

  // Background and Tile lock to fixed canvas dimensions; Sprite stays free-form.
  const fixedSize =
    selectedAsset === AssetType.Background
      ? BACKGROUND_SIZE
      : selectedAsset === AssetType.Tile
        ? TILE_SIZE
        : undefined;

  const applyPreset = (n: number) => {
    if (isGenerating) return;
    setWidth(n);
    setHeight(n);
  };

  return (
    <div className="space-y-3">
      {/* Asset type + Size on one row (mirrors the mockup) */}
      <div className="flex gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <DefaultDropDown
            stacked
            options={ASSET_OPTIONS}
            value={ALL_ASSETS_TYPE.indexOf(selectedAsset)}
            onChange={(index) => {
              if (!isGenerating) setSelectedAsset(ALL_ASSETS_TYPE[index]);
            }}
            disabled={isGenerating}>
            Asset type
          </DefaultDropDown>
        </div>

        <div className="min-w-0 flex-1">
          <label className="form-label">Size</label>
          {/* Remount per asset type so the locked dimensions re-apply on every
              switch (Background → 160×120, Tile → 16×16; Sprite is editable). */}
          <SizeInputs
            key={selectedAsset}
            fixedSize={fixedSize}
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Quick square presets — Sprite only (free-form sizing); shown in the
          Studio Generate modal, hidden in the minimal hero entry widget. */}
      {selectedAsset === AssetType.Sprite && showSizePresets && (
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SIZES.map((n) => {
            const active = width === n && height === n;
            return (
              <Button
                key={n}
                variant="chip"
                pressed={active}
                disabled={isGenerating}
                onClick={() => applyPreset(n)}>
                {n}×{n}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssetOptionsSelection;
