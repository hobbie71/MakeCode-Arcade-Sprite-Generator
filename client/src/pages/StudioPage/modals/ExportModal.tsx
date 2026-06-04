import { useMemo, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
import CodeDisplay from "../../../features/ExportSection/components/CodeDisplay";
import { useExportSpriteData } from "../../../features/SpriteEditor/hooks/useExportSpriteData";
import { ImageExportFormats } from "../../../types/export";
import { OS } from "../../../utils/getOS";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const command = OS === "mac" ? "Cmd" : "Ctrl";

const PASTE_STEPS = [
  "Copy the sprite with the button above.",
  "Open your sprite's image editor in MakeCode Arcade.",
  `Click the canvas and press ${command} + V to paste.`,
];

export default function ExportModal({ isOpen, onClose }: Props) {
  const {
    getImgCode,
    getSpriteDataUrl,
    exportSpriteToImage,
    getJavaScriptCode,
    getPythonCode,
  } = useExportSpriteData();

  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

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
      subtitle="Paste straight into MakeCode Arcade, or download an image."
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }>
      {/* Primary: Copy for MakeCode */}
      <div className="rounded-card border border-accent-border bg-accent-soft p-4">
        <span className="text-2xs font-semibold uppercase tracking-wide text-accent">
          Recommended
        </span>
        <div className="mt-2 flex items-center gap-4">
          <div className="transparent shrink-0 rounded-md border border-line p-1">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Your sprite"
                width={56}
                height={56}
                className="h-14 w-14"
                style={{ imageRendering: "pixelated" }}
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-ink">
              Copy for MakeCode
            </h3>
            <p className="text-sm text-ink-muted">
              Copies the sprite as a MakeCode <code>img</code> literal — paste it
              into the Arcade editor.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={copyForMakeCode}
          className="mt-4 w-full">
          {copied ? "Copied!" : "⧉ Copy for MakeCode"}
        </Button>
      </div>

      {/* How to paste */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold text-ink">
          How to paste into MakeCode Arcade
        </h4>
        <ol className="mt-2 space-y-2">
          {PASTE_STEPS.map((step, i) => (
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
        <div className="grid grid-cols-3 gap-3">
          {Object.values(ImageExportFormats).map((format) => (
            <Button
              key={format}
              variant="secondary"
              onClick={() => exportSpriteToImage(format)}>
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Tertiary: developer code (collapsible, low-emphasis) */}
      <div className="mt-6 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium text-ink-muted transition-colors hover:text-ink">
          <span>Developer code (JavaScript / Python)</span>
          <span aria-hidden>{showCode ? "▴" : "▾"}</span>
        </button>
        {showCode && (
          <div className="mt-3 space-y-4">
            <div>
              <p className="mb-1 text-xs font-medium text-ink-subtle">
                JavaScript
              </p>
              <CodeDisplay codingLanguage="javascript">
                {getJavaScriptCode()}
              </CodeDisplay>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-ink-subtle">Python</p>
              <CodeDisplay codingLanguage="python">
                {getPythonCode()}
              </CodeDisplay>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
