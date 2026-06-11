import { useMemo, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { ImageExportFormats } from "../../../types/export";
import { OS } from "../../../utils/getOS";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const command = OS === "mac" ? "Cmd" : "Ctrl";

export default function ExportModal({ isOpen, onClose }: Props) {
  const { getImgCode, getSpriteDataUrl, exportSpriteToImage } =
    useExportSpriteData();
  const { width, height } = useCanvasSize();

  const [copied, setCopied] = useState(false);

  // Paste walkthrough — step 3 names the live sprite size so the user resizes the
  // Arcade canvas to match before pasting.
  const pasteSteps = [
    "Copy the sprite with the button above.",
    "Open your sprite's image editor in MakeCode Arcade.",
    `Resize the canvas to ${width} × ${height}.`,
    `Click the canvas and press ${command} + V to paste.`,
  ];

  // Only render the sprite to a data URL while the modal is open.
  const previewUrl = useMemo(
    () => (isOpen ? getSpriteDataUrl(ImageExportFormats.PNG) : ""),
    [isOpen, getSpriteDataUrl]
  );

  const copyForMakeCode = async () => {
    try {
      await navigator.clipboard.writeText(getImgCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Export sprite"
      subtitle="Paste straight into MakeCode Arcade, or download an image.">
      {/* Primary: Copy for MakeCode — flips to a success treatment once copied */}
      <div
        className={`rounded-card border p-4 transition-colors ${
          copied
            ? "border-success bg-success-soft"
            : "border-accent-border bg-accent-soft"
        }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="transparent shrink-0 rounded-md border border-line p-1">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Your sprite"
                width={56}
                height={56}
                className="h-12 w-12 sm:h-14 sm:w-14"
                style={{ imageRendering: "pixelated" }}
              />
            )}
          </div>
          {/* Stacks vertically on phones; splits into text | size from sm up */}
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            {/* Title + description */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-ink">
                Copy for MakeCode
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                Copies the sprite as a MakeCode <code>img</code> literal.
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Paste directly into MakeCode sprite editor.
              </p>
            </div>
            {/* Sprite dimensions — inline row on phones, label-above-pill from sm up */}
            <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-1.5">
              <span className="text-2xs font-semibold uppercase tracking-wide text-ink-subtle">
                Sprite size
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold text-on-accent transition-colors ${
                  copied ? "bg-success" : "bg-accent"
                }`}>
                {width} × {height}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant={copied ? "success" : "primary"}
          onClick={copyForMakeCode}
          className="mt-4 w-full active:!translate-y-0">
          {copied ? "✓ Copied!" : "⧉ Copy for MakeCode"}
        </Button>
      </div>

      {/* How to paste — demo video + written steps */}
      <div className="mt-5">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span aria-hidden className="text-ink-subtle">
            ⓘ
          </span>
          How to paste into MakeCode Arcade
        </h4>

        {/* Walkthrough video — muted autoplay loop, scales 16:9 at every breakpoint */}
        <div className="mt-3 overflow-hidden rounded-card border border-line bg-surface">
          <video
            className="aspect-video w-full"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="Demo: exporting your sprite into MakeCode Arcade">
            <source src="/export-demo.webm" type="video/webm" />
            <source src="/export-demo.mp4" type="video/mp4" />
          </video>
        </div>

        <ol className="mt-4 space-y-2">
          {pasteSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-muted">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft-2 text-2xs font-semibold text-accent">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Download as image */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold text-ink">
          Download as image
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.values(ImageExportFormats).map((format) => (
            <Button
              key={format}
              variant="outline"
              onClick={() => exportSpriteToImage(format)}>
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
