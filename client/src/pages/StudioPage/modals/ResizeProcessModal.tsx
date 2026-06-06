import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import CheckBox from "../../../features/InputSection/components/CheckBox";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useImageFileHandler } from "../../../features/InputSection/hooks/useImageFileHandler";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { useCanvasResize } from "../../../hooks/useCanvasResize";
import { Crop, ImageExportFormats } from "../../../types/export";
import type { PostProcessingSettings } from "../../../types/export";
import { MAX_LENGTH, MIN_LENGTH } from "../../../types/pixel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [16, 24, 32, 48, 64, 80, 96, 120];
const CROP_MODES: { label: string; value: Crop }[] = [
  { label: "None", value: Crop.None },
  { label: "Trim edges", value: Crop.Edges },
  { label: "Fill", value: Crop.Fill },
];

type Snapshot = { w: number; h: number; settings: PostProcessingSettings };

const clampSize = (n: number) => Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, n));

/**
 * Resize & Process (mockup: resize-process modal). Stage dimensions, fit/crop
 * and background-removal, watch a *live* preview, then Apply to re-process the
 * cached source image into the editor.
 *
 * Preview cost model: re-processing the full-resolution source (flood-fill
 * background removal + palette snap + scale) is expensive, so discrete controls
 * (size presets, fit/crop, the remove-bg toggle) refresh the preview instantly,
 * while continuous edits (typing a custom dimension, dragging Tolerance) only
 * mark it stale — the user clicks "Update preview" to recompute. Nothing touches
 * the editor until Apply; Cancel / Esc / backdrop fully restore the prior state.
 */
export default function ResizeProcessModal({ isOpen, onClose }: Props) {
  const { width, height, setWidth, setHeight } = useCanvasSize();
  const { settings, updateSetting } = usePostProcessing();
  const { sourceImage, processImageToSprite, processSourceToCanvas } =
    useImageFileHandler();
  const { getSpriteDataUrl } = useExportSpriteData();
  const { updateCanvasSize } = useCanvasResize();

  // Snapshot size + settings on open so closing-without-Apply restores them.
  const snapshot = useRef<Snapshot | null>(null);
  // Monotonic token so a slow preview run can't overwrite a newer one.
  const previewToken = useRef(0);

  const [previewUrl, setPreviewUrl] = useState("");
  const [isStale, setIsStale] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Local text for the dimension fields keeps typing smooth; the staged
  // width/height (context) are derived from these and from preset clicks.
  const [widthText, setWidthText] = useState(String(width));
  const [heightText, setHeightText] = useState(String(height));
  useEffect(() => setWidthText(String(width)), [width]);
  useEffect(() => setHeightText(String(height)), [height]);

  /** Re-run the real pipeline on the cached source and show the result. */
  const runPreview = useCallback(
    async (w: number, h: number, s: PostProcessingSettings) => {
      if (!sourceImage) return;
      const token = ++previewToken.current;
      setIsProcessing(true);
      try {
        const canvas = await processSourceToCanvas(sourceImage, w, h, s);
        if (token !== previewToken.current) return; // superseded by a newer run
        setPreviewUrl(canvas.toDataURL("image/png"));
        setIsStale(false);
      } catch {
        // Keep the previous preview on failure.
      } finally {
        if (token === previewToken.current) setIsProcessing(false);
      }
    },
    [sourceImage, processSourceToCanvas]
  );

  // Initialise once per open: snapshot the starting state and seed the preview.
  useEffect(() => {
    if (!isOpen) {
      snapshot.current = null;
      return;
    }
    if (snapshot.current) return;
    snapshot.current = { w: width, h: height, settings: { ...settings } };
    setIsStale(false);
    if (sourceImage) {
      runPreview(width, height, settings);
    } else {
      // No cached source (hand-drawn sprite): show the current sprite as-is.
      setPreviewUrl(getSpriteDataUrl(ImageExportFormats.PNG));
    }
  }, [
    isOpen,
    width,
    height,
    settings,
    sourceImage,
    runPreview,
    getSpriteDataUrl,
  ]);

  // --- Discrete controls: stage + auto-refresh the preview ------------------
  const applyPreset = (size: number) => {
    setWidth(size);
    setHeight(size);
    runPreview(size, size, settings);
  };
  const applyCrop = (value: Crop) => {
    updateSetting("crop", value);
    runPreview(width, height, { ...settings, crop: value });
  };
  const applyRemoveBackground = (on: boolean) => {
    updateSetting("removeBackground", on);
    runPreview(width, height, { ...settings, removeBackground: on });
  };

  // --- Continuous controls: stage + mark stale (manual "Update preview") ----
  const stageDimension = (axis: "w" | "h", raw: string) => {
    if (axis === "w") setWidthText(raw);
    else setHeightText(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n >= MIN_LENGTH && n <= MAX_LENGTH) {
      if (axis === "w") setWidth(n);
      else setHeight(n);
    }
    if (sourceImage) setIsStale(true);
  };
  const commitDimension = (axis: "w" | "h") => {
    const raw = axis === "w" ? widthText : heightText;
    const parsed = parseInt(raw, 10);
    const fallback = axis === "w" ? width : height;
    const n = clampSize(Number.isNaN(parsed) ? fallback : parsed);
    if (axis === "w") {
      setWidth(n);
      setWidthText(String(n));
    } else {
      setHeight(n);
      setHeightText(String(n));
    }
  };
  const setTolerance = (value: number) => {
    updateSetting("tolerance", value);
    if (sourceImage) setIsStale(true);
  };

  const refreshPreview = () => runPreview(width, height, settings);

  // --- Footer actions -------------------------------------------------------
  const restoreSnapshot = () => {
    const s = snapshot.current;
    if (!s) return;
    setWidth(s.w);
    setHeight(s.h);
    updateSetting("removeBackground", s.settings.removeBackground);
    updateSetting("crop", s.settings.crop);
    updateSetting("tolerance", s.settings.tolerance);
  };
  // X / Escape / backdrop / Cancel all discard changes.
  const handleCancel = () => {
    restoreSnapshot();
    onClose();
  };
  const handleApply = async () => {
    snapshot.current = null; // commit — don't restore on the resulting close
    if (sourceImage) {
      await processImageToSprite(sourceImage);
    } else {
      // Hand-drawn sprite: no source to re-process, so resample the grid.
      updateCanvasSize(width, height);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      title="Resize & Process"
      subtitle="Re-processing is deliberate — adjust, preview, then apply."
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel}>
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">Dimensions</h4>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                aria-label="Width"
                value={widthText}
                onChange={(e) =>
                  stageDimension("w", e.target.value.replace(/[^0-9]/g, ""))
                }
                onBlur={() => commitDimension("w")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitDimension("w");
                }}
                className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-center text-lg font-bold text-ink focus:border-accent focus:outline-none"
              />
              <span aria-hidden className="text-ink-subtle">
                ×
              </span>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Height"
                value={heightText}
                onChange={(e) =>
                  stageDimension("h", e.target.value.replace(/[^0-9]/g, ""))
                }
                onBlur={() => commitDimension("h")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitDimension("h");
                }}
                className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-center text-lg font-bold text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((size) => {
                const active = width === size && height === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => applyPreset(size)}
                    className={`rounded-md border px-2.5 py-1 text-sm transition-colors ${
                      active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line text-ink-muted hover:bg-surface-hover"
                    }`}>
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">
              Fit / crop mode
            </h4>
            <div className="flex gap-2">
              {CROP_MODES.map(({ label, value }) => {
                const active = settings.crop === value;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => applyCrop(value)}
                    className={`flex-1 whitespace-nowrap rounded-md border px-2 py-1.5 text-sm transition-colors sm:px-3 ${
                      active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line text-ink-muted hover:bg-surface-hover"
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-ink-subtle">
              How the source is fit into the new dimensions.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-3">
            <CheckBox
              checked={settings.removeBackground}
              onChange={applyRemoveBackground}>
              Remove background
            </CheckBox>
            {settings.removeBackground && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                  <span>Tolerance</span>
                  <span>{settings.tolerance}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={settings.tolerance}
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
                    isStale ? "opacity-60 blur-[3px]" : ""
                  }`}
                  style={{ imageRendering: "pixelated" }}
                />
              )}

              {/* Size badge (mockup) */}
              <span className="absolute bottom-2 right-2 rounded-md border border-line bg-surface-raised/90 px-2 py-0.5 text-xs font-medium text-ink-muted">
                {width}×{height}
              </span>

              {/* Processing indicator */}
              {isProcessing && (
                <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-medium text-surface-raised">
                  Processing…
                </span>
              )}
            </div>

            {/* Manual refresh gate: custom dimensions + tolerance are expensive */}
            {isStale && sourceImage && (
              <Button
                variant="secondary"
                onClick={refreshPreview}
                disabled={isProcessing}
                className="mt-3 w-full">
                <span aria-hidden className="mr-1.5">
                  ⟳
                </span>
                {isProcessing ? "Updating…" : "Update preview"}
              </Button>
            )}
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-subtle">
            <span aria-hidden>ⓘ</span>
            <span>
              Output is snapped to the active palette
              {settings.removeBackground ? " and background removed." : "."}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
