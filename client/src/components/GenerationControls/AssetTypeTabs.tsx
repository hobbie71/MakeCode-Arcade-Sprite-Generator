import { useEffect, useRef } from "react";
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

interface Props {
  /** "hero" applies the preset on mount (no live editor to disturb) so a fresh
   *  Sprite gets its 64×64 default. "studio" skips the mount apply: the tabs sit
   *  in the Generate modal over a live editor whose size IS CanvasSizeContext, so
   *  applying on open would resample in-progress artwork. Studio applies only on
   *  an explicit user tab change. */
  surface?: "hero" | "studio";
}

/**
 * Top-level asset-type selector (Sprite / Background / Tile). Picking a type
 * applies that type's preset (size + fit + background-removal) so generation,
 * upload, and Resize & Process use the right defaults. Lives in the generation
 * surface only.
 */
export default function AssetTypeTabs({ surface = "hero" }: Props) {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const applyAssetPreset = useApplyAssetPreset();
  const { isGenerating } = useLoading();

  // In the studio the tabs sit over a live editor whose dimensions ARE
  // CanvasSizeContext, so applying on mount would resample the current sprite.
  // Skip the first (mount) run there; the hero has no live editor and applies on
  // mount to seed the default size.
  const skipMountRef = useRef(surface === "studio");

  useEffect(() => {
    if (skipMountRef.current) {
      skipMountRef.current = false;
      return;
    }
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
