import { useEffect, useState } from "react";

import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import SpriteThumbnail from "./SpriteThumbnail";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useSourceGhost } from "../contexts/SourceGhostContext/useSourceGhost";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
}

/**
 * Right-dock Source section: the cached source image (what Generate produced
 * and Resize & Process re-consumes), ghost-overlay controls, an
 * Original-vs-Sprite compare, and contextual actions. Shows a generate CTA
 * when no source exists (blank canvas / pasted sprite). There is deliberately
 * no "clear" action: dropping the source would disable free re-processing.
 */
export default function SourcePanel({ onOpenGenerate, onOpenResize }: Props) {
  const { sourceImage } = useImageImports();
  const { ghostVisible, setGhostVisible, ghostOpacity, setGhostOpacity } =
    useSourceGhost();
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // One object URL per source file, revoked on change/unmount.
  useEffect(() => {
    if (!sourceImage) {
      setSourceUrl(null);
      return;
    }
    const url = URL.createObjectURL(sourceImage);
    setSourceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sourceImage]);

  if (!sourceImage || !sourceUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-surface p-4 text-center">
        <p className="text-xs leading-relaxed text-ink-subtle">
          No source image yet. Generate or upload one and it will appear here
          for tracing, comparing and re-processing.
        </p>
        <Button variant="primary" onClick={onOpenGenerate}>
          ✦ Generate
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Source image viewer */}
      <div className="transparent flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-line">
        <img
          src={sourceUrl}
          alt="Source image"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Ghost overlay controls */}
      <div className="rounded-md border border-line p-2">
        <Switch
          label="Show on canvas"
          title="Project the source image over the canvas for tracing"
          checked={ghostVisible}
          onChange={setGhostVisible}
          className="w-full justify-between"
        />
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Opacity</span>
            <span>{Math.round(ghostOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(ghostOpacity * 100)}
            onChange={(e) => setGhostOpacity(Number(e.target.value) / 100)}
            disabled={!ghostVisible}
            className="range-input"
            aria-label="Ghost opacity"
          />
        </div>
      </div>

      {/* Original vs sprite compare */}
      <div className="grid grid-cols-2 gap-2">
        <figure className="min-w-0">
          <div className="transparent flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line">
            <img
              src={sourceUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <figcaption className="mt-1 text-center text-xs text-ink-muted">
            Original
          </figcaption>
        </figure>
        <figure className="min-w-0">
          <div className="transparent flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line p-1">
            <SpriteThumbnail />
          </div>
          <figcaption className="mt-1 text-center text-xs text-ink-muted">
            Sprite
          </figcaption>
        </figure>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onOpenResize} className="flex-1">
          ⟲ Re-process
        </Button>
        <a
          href={sourceUrl}
          download={sourceImage.name}
          className="btn-outline flex-1 text-center">
          ⬇ Download
        </a>
      </div>
    </div>
  );
}
