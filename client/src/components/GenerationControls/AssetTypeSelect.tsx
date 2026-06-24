import type { ReactNode } from "react";

import DefaultDropDown from "../DefaultDropDown";
import { useAssetType } from "../../context/AssetTypeContext/useAssetType";
import { useOpenAISettings } from "../../context/OpenAISettingsContext/useOpenAISettings";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useShakeOnError } from "../../hooks/useShakeOnError";
import { AssetType, ALL_ASSETS_TYPE } from "../../types/export";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Asset-type glyphs — light inline SVGs that inherit `currentColor`.
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

// Per-type subtitle + icon shown in the dropdown rows. Partial: only the asset
// types surfaced in ALL_ASSETS_TYPE need an entry.
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

interface Props {
  /** Bumped by the parent each time the user tries to Generate without choosing a
   *  type. A value > 0 with no selection drives the red border + shake. */
  errorNonce: number;
}

/**
 * Required asset-type dropdown for the AI Generate card. Starts EMPTY — the user
 * must pick Sprite / Background / Tile before generating (the parent validates and
 * bumps `errorNonce` to flash this red + shake it). Choosing a type sets the
 * shared AssetTypeContext and syncs the OpenAI wire `assetType` so generation is
 * type-aware. The Resize & Process modal later applies that type's preset.
 */
export default function AssetTypeSelect({ errorNonce }: Props) {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { updateSetting } = useOpenAISettings();
  const { isGenerating } = useLoading();

  const hasError = errorNonce > 0 && selectedAsset == null;
  const shaking = useShakeOnError(errorNonce);

  const value = selectedAsset ? ALL_ASSETS_TYPE.indexOf(selectedAsset) : -1;

  return (
    <div className={shaking ? "animate-shake" : ""}>
      <DefaultDropDown
        options={ASSET_OPTIONS}
        value={value}
        ariaLabel="Choose type…"
        error={hasError}
        disabled={isGenerating}
        onChange={(index) => {
          const type = ALL_ASSETS_TYPE[index];
          setSelectedAsset(type);
          updateSetting("assetType", type);
        }}>
        Asset type
      </DefaultDropDown>
    </div>
  );
}
