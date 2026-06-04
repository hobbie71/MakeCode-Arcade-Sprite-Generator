import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import SizeInputs from "../../../features/InputSection/components/SizeInputs";
import CheckBox from "../../../features/InputSection/components/CheckBox";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useImageFileHandler } from "../../../features/InputSection/hooks/useImageFileHandler";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { Crop, ImageExportFormats } from "../../../types/export";
import type { PostProcessingSettings } from "../../../types/export";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [16, 24, 32, 48, 64, 80, 96, 128];
const CROP_MODES: { label: string; value: Crop }[] = [
  { label: "None", value: Crop.None },
  { label: "Trim edges", value: Crop.Edges },
  { label: "Fill", value: Crop.Fill },
];

type Snapshot = { w: number; h: number; settings: PostProcessingSettings };

export default function ResizeProcessModal({ isOpen, onClose }: Props) {
  const { width, height, setWidth, setHeight } = useCanvasSize();
  const { settings, updateSetting } = usePostProcessing();
  const { sourceImage, processImageToSprite } = useImageFileHandler();
  const { getSpriteDataUrl } = useExportSpriteData();

  // Snapshot size + settings on open so closing-without-Apply restores them.
  const snapshot = useRef<Snapshot | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (!snapshot.current) {
        snapshot.current = { w: width, h: height, settings: { ...settings } };
        // Capture a static preview of the current sprite (Apply re-processes).
        setPreviewUrl(getSpriteDataUrl(ImageExportFormats.PNG));
      }
    } else {
      snapshot.current = null;
    }
  }, [isOpen, width, height, settings, getSpriteDataUrl]);

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
    if (!sourceImage) return;
    snapshot.current = null; // commit — don't restore on the resulting close
    await processImageToSprite(sourceImage);
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
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!sourceImage}>
            Apply changes
          </Button>
        </>
      }>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">Dimensions</h4>
            <SizeInputs />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((size) => {
                const active = width === size && height === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setWidth(size);
                      setHeight(size);
                    }}
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
                    onClick={() => updateSetting("crop", value)}
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

          <div className="rounded-card border border-line p-3">
            <CheckBox
              checked={settings.removeBackground}
              onChange={(bool: boolean) =>
                updateSetting("removeBackground", bool)
              }>
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
                  onChange={(e) =>
                    updateSetting("tolerance", Number(e.target.value))
                  }
                  className="range-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Live preview</h4>
          <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface p-4">
            <div className="transparent flex h-48 w-48 items-center justify-center rounded-md border border-line">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Current sprite"
                  className="max-h-full max-w-full"
                  style={{ imageRendering: "pixelated" }}
                />
              )}
            </div>
            <span className="text-xs text-ink-subtle">
              {width} × {height}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-subtle">
            Apply re-processes the cached source at the new size — free, no token.
          </p>
        </div>
      </div>
    </Modal>
  );
}
