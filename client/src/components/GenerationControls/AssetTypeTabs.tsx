import { useEffect } from "react";
import SegmentedControl, { type SegmentOption } from "../SegmentedControl";
import { useAssetType } from "../../context/AssetTypeContext/useAssetType";
import { useApplyAssetPreset } from "../../hooks/useApplyAssetPreset";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { AssetType, ALL_ASSETS_TYPE } from "../../types/export";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ASSET_TABS: SegmentOption<AssetType>[] = ALL_ASSETS_TYPE.map((type) => ({
  value: type,
  label: cap(type),
}));

/**
 * Top-level asset-type selector (Sprite / Background / Tile). Picking a type is
 * the first choice in the generation flow: the effect applies that type's preset
 * (size + fit + background-removal) so generation, upload, and Resize & Process
 * all use the right defaults. Lives in the generation surface only — it sets the
 * NEXT sprite's target, never the live editor canvas.
 */
export default function AssetTypeTabs() {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const applyAssetPreset = useApplyAssetPreset();
  const { isGenerating } = useLoading();

  // Single apply path: any time the selected type changes (including initial
  // mount), push its preset into the shared contexts.
  useEffect(() => {
    applyAssetPreset(selectedAsset);
  }, [selectedAsset, applyAssetPreset]);

  return (
    <SegmentedControl
      options={ASSET_TABS}
      value={selectedAsset}
      onChange={setSelectedAsset}
      ariaLabel="Asset type"
      stretch
      disabled={isGenerating}
    />
  );
}
