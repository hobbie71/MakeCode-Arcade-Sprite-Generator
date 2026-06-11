import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import SegmentedControl from "../../../components/SegmentedControl";
import Spinner from "../../../components/Spinner";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useRightDock } from "../../../context/RightDockContext/useRightDock";
import { useImageFileHandler } from "../../../features/InputSection/hooks/useImageFileHandler";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { useSpriteData } from "../../../features/SpriteEditor/hooks/useSpriteData";
import { useCanvasResize } from "../../../hooks/useCanvasResize";
import { getResizedSpriteData } from "../../../libs/getResizedSpriteData";
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
    setStagedW(width);
    setStagedH(height);
    setWidthText(String(width));
    setHeightText(String(height));
    setStagedSettings({ ...settings });
    setIsStale(false);
    runPreview(width, height, settings);
  }, [isOpen, width, height, settings, runPreview]);

  // --- Discrete controls: stage + recompute the preview instantly -----------
  const applyPreset = (size: number) => {
    setStagedW(size);
    setStagedH(size);
    setWidthText(String(size));
    setHeightText(String(size));
    runPreview(size, size, stagedSettings);
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
                const active = stagedW === size && stagedH === size;
                return (
                  <Button
                    key={size}
                    variant="chip"
                    pressed={active}
                    onClick={() => applyPreset(size)}>
                    {size}
                  </Button>
                );
              })}
            </div>
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
                  onClick={refreshPreview}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
                  <span aria-hidden className="mr-1.5">
                    ⟳
                  </span>
                  Update preview
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
    </Modal>
  );
}
