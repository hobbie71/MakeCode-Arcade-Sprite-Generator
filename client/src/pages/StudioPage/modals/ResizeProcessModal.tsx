import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import SegmentedControl, {
  type SegmentOption,
} from "../../../components/SegmentedControl";
import Spinner from "../../../components/Spinner";
import { useAssetType } from "../../../context/AssetTypeContext/useAssetType";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useRightDock } from "../../../context/RightDockContext/useRightDock";
import { useImageFileHandler } from "../../../features/InputSection/hooks/useImageFileHandler";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { useSpriteData } from "../../../features/SpriteEditor/hooks/useSpriteData";
import { useCanvasResize } from "../../../hooks/useCanvasResize";
import { getResizedSpriteData } from "../../../libs/getResizedSpriteData";
import { getAssetPreset } from "../../../config/assetPresets";
import {
  ALL_ASSETS_TYPE,
  AssetType,
  Crop,
  ImageExportFormats,
} from "../../../types/export";
import type { PostProcessingSettings } from "../../../types/export";
import { MAX_LENGTH, MIN_LENGTH } from "../../../types/pixel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS: { w: number; h: number }[] = [
  { w: 16, h: 16 },
  { w: 24, h: 24 },
  { w: 32, h: 32 },
  { w: 48, h: 48 },
  { w: 64, h: 64 },
  { w: 80, h: 80 },
  { w: 96, h: 96 },
  { w: 120, h: 120 },
  { w: 160, h: 120 },
];
// Blessed tile sizes — the only size choices when the asset type is Tile.
const TILE_SIZES: { w: number; h: number }[] = [
  { w: 16, h: 16 },
  { w: 8, h: 8 },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ASSET_TABS: SegmentOption<AssetType>[] = ALL_ASSETS_TYPE.map((type) => ({
  value: type,
  label: cap(type),
}));

/** Small padlock glyph for the "dimensions locked" hint (no emoji). */
const LockIcon = () => (
  <svg
    className="h-3.5 w-3.5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" strokeWidth={1.6} />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

/** One dimension field (Width or Height). Typing stages the value; blur/Enter
 *  commits it. Disabled when the asset type locks the size. */
function DimensionInput({
  axis,
  value,
  disabled,
  onStage,
  onCommit,
}: {
  axis: "w" | "h";
  value: string;
  disabled: boolean;
  onStage: (raw: string) => void;
  onCommit: () => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={axis === "w" ? "Width" : "Height"}
      value={value}
      disabled={disabled}
      onChange={(e) => onStage(e.target.value.replace(/[^0-9]/g, ""))}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
      }}
      className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-center text-lg font-bold text-ink focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

/** A row of one-click size chips. The label defaults to the square size (e.g.
 *  "16") or W×H for non-square presets (e.g. "160×120"). */
function SizeChips({
  sizes,
  w,
  h,
  onPick,
  format = (s) => (s.w === s.h ? String(s.w) : `${s.w}×${s.h}`),
}: {
  sizes: { w: number; h: number }[];
  w: number;
  h: number;
  onPick: (w: number, h: number) => void;
  format?: (s: { w: number; h: number }) => string;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Button
          key={`${size.w}x${size.h}`}
          variant="chip"
          pressed={w === size.w && h === size.h}
          onClick={() => onPick(size.w, size.h)}>
          {format(size)}
        </Button>
      ))}
    </div>
  );
}
const CROP_MODES: { label: string; value: Crop }[] = [
  { label: "None", value: Crop.None },
  { label: "Trim edges", value: Crop.Edges },
  { label: "Fill", value: Crop.Fill },
];

const clampSize = (n: number) => Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, n));

/**
 * Resize & Process (mockup: resize-process modal). Stage dimensions, fit/crop
 * and background-removal, watch a *live* preview, then Apply to commit the
 * re-processed result to the editor.
 *
 * Nothing here touches the editor until Apply. The dimensions, crop mode and
 * background-removal settings are all held in LOCAL state (seeded from the
 * editor when the modal opens) — earlier versions wrote straight to the shared
 * canvas-size / post-processing contexts, which made `SpriteDataResizer`
 * destructively resample the real sprite on every keystroke and preset click.
 *
 * Preview cost model: re-processing the source (flood-fill background removal +
 * palette snap + scale) or resampling a hand-drawn grid is expensive, so:
 *   - discrete controls (size presets, fit/crop, the remove-bg toggle) recompute
 *     the preview instantly, while
 *   - continuous edits (typing a custom dimension, dragging Tolerance) only mark
 *     it stale — the blurred preview + "Update preview" button recompute on demand.
 * Cancel / Esc / backdrop simply close: there is nothing to roll back.
 */
export default function ResizeProcessModal({ isOpen, onClose }: Props) {
  const { width, height, setWidth, setHeight } = useCanvasSize();
  const { settings, updateSetting } = usePostProcessing();
  const { sourceImage, processImageToSprite, processSourceToCanvas } =
    useImageFileHandler();
  const { getSpriteDataUrl } = useExportSpriteData();
  const { getCurrentSpriteData } = useSpriteData();
  const { updateCanvasSize } = useCanvasResize();
  const { setActiveSection } = useRightDock();
  const { selectedAsset, setSelectedAsset } = useAssetType();

  // Per-type dimension locking: Background is fixed at 160×120, Tile is fixed to a
  // blessed tile size (16/8 toggle), Sprite (and the type-less upload / hand-drawn
  // paths) stay free-form. Fit/crop and background-removal remain editable for all.
  const isBackground = selectedAsset === AssetType.Background;
  const isTile = selectedAsset === AssetType.Tile;
  const freeDims = !isBackground && !isTile;

  // Seed staged state from the editor exactly once per open.
  const seededRef = useRef(false);
  // Monotonic token so a slow preview run can't overwrite a newer one.
  const previewToken = useRef(0);

  const [previewUrl, setPreviewUrl] = useState("");
  const [isStale, setIsStale] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Staged working state — committed to the editor only on Apply.
  const [stagedW, setStagedW] = useState(width);
  const [stagedH, setStagedH] = useState(height);
  const [stagedSettings, setStagedSettings] =
    useState<PostProcessingSettings>(settings);
  // Local text for the dimension fields keeps typing smooth; the staged numeric
  // width/height are derived from these and from preset clicks.
  const [widthText, setWidthText] = useState(String(width));
  const [heightText, setHeightText] = useState(String(height));

  /**
   * Recompute the preview for the given staged values WITHOUT touching the editor.
   * With a cached source we re-run the real image pipeline; for a hand-drawn
   * sprite we resample the current grid — the same result Apply will produce.
   */
  const runPreview = useCallback(
    async (w: number, h: number, s: PostProcessingSettings) => {
      const token = ++previewToken.current;
      setIsProcessing(true);
      try {
        let url: string;
        if (sourceImage) {
          const canvas = await processSourceToCanvas(sourceImage, w, h, s);
          if (token !== previewToken.current) return; // superseded
          url = canvas.toDataURL("image/png");
        } else {
          const resized = getResizedSpriteData(getCurrentSpriteData(), w, h);
          url = getSpriteDataUrl(ImageExportFormats.PNG, resized, w, h);
        }
        if (token !== previewToken.current) return;
        setPreviewUrl(url);
        setIsStale(false);
      } catch {
        // Keep the previous preview on failure.
      } finally {
        if (token === previewToken.current) setIsProcessing(false);
      }
    },
    [sourceImage, processSourceToCanvas, getCurrentSpriteData, getSpriteDataUrl]
  );

  // Seed staged state + the preview once per open.
  useEffect(() => {
    if (!isOpen) {
      seededRef.current = false;
      return;
    }
    if (seededRef.current) return;
    seededRef.current = true;
    // When a type was chosen up front (AI flow), seed from its preset so the modal
    // opens at the right dimensions + fit/background defaults. Uploads / hand-drawn
    // sprites have no type → fall back to the editor's current size + settings.
    const preset = selectedAsset ? getAssetPreset(selectedAsset) : null;
    const seedW = preset ? preset.defaultSize.width : width;
    const seedH = preset ? preset.defaultSize.height : height;
    const seedSettings = preset ? { ...preset.postProcessing } : { ...settings };
    setStagedW(seedW);
    setStagedH(seedH);
    setWidthText(String(seedW));
    setHeightText(String(seedH));
    setStagedSettings(seedSettings);
    setIsStale(false);
    runPreview(seedW, seedH, seedSettings);
  }, [isOpen, width, height, settings, selectedAsset, runPreview]);

  // --- Discrete controls: stage + recompute the preview instantly -----------
  const applyPreset = (w: number, h: number) => {
    setStagedW(w);
    setStagedH(h);
    setWidthText(String(w));
    setHeightText(String(h));
    runPreview(w, h, stagedSettings);
  };
  const applyCrop = (value: Crop) => {
    const next = { ...stagedSettings, crop: value };
    setStagedSettings(next);
    runPreview(stagedW, stagedH, next);
  };
  const applyRemoveBackground = (on: boolean) => {
    const next = { ...stagedSettings, removeBackground: on };
    setStagedSettings(next);
    runPreview(stagedW, stagedH, next);
  };
  // Asset-type tabs: picking a type applies its preset (size + fit + background)
  // to the staged state and re-runs the preview. Dimension locking follows from
  // selectedAsset; fit + background stay editable afterward.
  const applyAssetType = (type: AssetType) => {
    setSelectedAsset(type);
    const preset = getAssetPreset(type);
    const w = preset.defaultSize.width;
    const h = preset.defaultSize.height;
    const next = { ...preset.postProcessing };
    setStagedW(w);
    setStagedH(h);
    setWidthText(String(w));
    setHeightText(String(h));
    setStagedSettings(next);
    runPreview(w, h, next);
  };

  // --- Continuous controls: stage + mark stale (manual "Update preview") ----
  const stageDimension = (axis: "w" | "h", raw: string) => {
    if (axis === "w") setWidthText(raw);
    else setHeightText(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n >= MIN_LENGTH && n <= MAX_LENGTH) {
      if (axis === "w") setStagedW(n);
      else setStagedH(n);
    }
    setIsStale(true);
  };
  const commitDimension = (axis: "w" | "h") => {
    const raw = axis === "w" ? widthText : heightText;
    const parsed = parseInt(raw, 10);
    const fallback = axis === "w" ? stagedW : stagedH;
    const n = clampSize(Number.isNaN(parsed) ? fallback : parsed);
    if (axis === "w") {
      setStagedW(n);
      setWidthText(String(n));
    } else {
      setStagedH(n);
      setHeightText(String(n));
    }
  };
  const setTolerance = (value: number) => {
    setStagedSettings((s) => ({ ...s, tolerance: value }));
    setIsStale(true);
  };

  const refreshPreview = () => runPreview(stagedW, stagedH, stagedSettings);

  // --- Footer actions -------------------------------------------------------
  const commitStagedSettings = () => {
    updateSetting("removeBackground", stagedSettings.removeBackground);
    updateSetting("crop", stagedSettings.crop);
    updateSetting("tolerance", stagedSettings.tolerance);
  };
  // X / Escape / backdrop / Cancel all discard staged changes — nothing to undo.
  const handleApply = async () => {
    commitStagedSettings();
    if (sourceImage) {
      // Re-process the cached source at the staged size/settings, then sync the
      // editor's canvas-size context to match the freshly pasted sprite.
      await processImageToSprite(sourceImage, {
        width: stagedW,
        height: stagedH,
        settings: stagedSettings,
      });
      setWidth(stagedW);
      setHeight(stagedH);
    } else {
      // Hand-drawn sprite: no source to re-process, so resample the grid.
      updateCanvasSize(stagedW, stagedH);
    }
    // Reprocessing complete — reveal the Source panel so the just-applied source
    // is front-and-center for tracing / comparing / re-processing.
    setActiveSection("source");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Resize & Process"
      subtitle="Re-processing is deliberate — adjust, preview, then apply."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            <span aria-hidden className="mr-1.5">
              ✓
            </span>
            Apply changes
          </Button>
        </>
      }>
      <div className="space-y-6">
        {/* Asset type — full-width selector at the very top; picking a type
            applies its preset to the dimensions / fit / background below. */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Asset type</h4>
          <SegmentedControl<AssetType>
            stretch
            ariaLabel="Asset type"
            value={selectedAsset as AssetType}
            onChange={applyAssetType}
            options={ASSET_TABS}
          />
          <p className="mt-1.5 text-xs text-ink-subtle">
            Applies that type's size, fit and background preset.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Controls */}
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">Dimensions</h4>
            <div className="flex items-center gap-3">
              <DimensionInput
                axis="w"
                value={widthText}
                disabled={!freeDims}
                onStage={(raw) => stageDimension("w", raw)}
                onCommit={() => commitDimension("w")}
              />
              <span aria-hidden className="text-ink-subtle">
                ×
              </span>
              <DimensionInput
                axis="h"
                value={heightText}
                disabled={!freeDims}
                onStage={(raw) => stageDimension("h", raw)}
                onCommit={() => commitDimension("h")}
              />
            </div>
            {/* Size choices: full presets for free-form (Sprite / uploads / hand-
                drawn), the blessed 16/8 toggle for tiles, none for a locked
                background. */}
            {freeDims && (
              <SizeChips
                sizes={PRESETS}
                w={stagedW}
                h={stagedH}
                onPick={applyPreset}
              />
            )}
            {isTile && (
              <SizeChips
                sizes={TILE_SIZES}
                w={stagedW}
                h={stagedH}
                onPick={applyPreset}
                format={(s) => `${s.w}×${s.h}`}
              />
            )}
            {!freeDims && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-subtle">
                <LockIcon />
                {isBackground
                  ? "Locked to 160×120 for backgrounds."
                  : "Tiles are 16×16 or 8×8."}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">
              Fit / crop mode
            </h4>
            <SegmentedControl<Crop>
              stretch
              ariaLabel="Fit / crop mode"
              value={stagedSettings.crop}
              onChange={applyCrop}
              options={CROP_MODES}
            />
            <p className="mt-1.5 text-xs text-ink-subtle">
              How the source is fit into the new dimensions.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-3">
            <Switch
              label="Remove background"
              checked={stagedSettings.removeBackground}
              onChange={applyRemoveBackground}
              className="w-full justify-between"
            />
            {stagedSettings.removeBackground && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                  <span>Tolerance</span>
                  <span>{stagedSettings.tolerance}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={stagedSettings.tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="range-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Live preview</h4>
          <div className="rounded-card border border-line bg-surface p-4">
            <div className="transparent relative mx-auto flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-line">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Processed sprite preview"
                  className={`h-full w-full object-contain transition duration-200 ${
                    isStale || isProcessing
                      ? "scale-105 opacity-50 blur-[6px]"
                      : ""
                  }`}
                  style={{ imageRendering: "pixelated" }}
                />
              )}

              {/* Processing: a centered spinner over the blurred preview. */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Spinner size="md" />
                  <span className="text-xs font-medium text-ink-muted">
                    Processing…
                  </span>
                </div>
              )}

              {/* Stale (typing a custom size / dragging Tolerance is expensive):
                  a centered call-to-action recomputes the preview on demand. */}
              {isStale && !isProcessing && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={refreshPreview}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-1.5 whitespace-nowrap shadow-lg">
                  <span aria-hidden>⟲</span> Update preview
                </Button>
              )}
            </div>
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-subtle">
            <span aria-hidden>ⓘ</span>
            <span>
              Output is snapped to the active palette
              {stagedSettings.removeBackground
                ? " and background removed."
                : "."}
            </span>
          </p>
        </div>
        </div>
      </div>
    </Modal>
  );
}
