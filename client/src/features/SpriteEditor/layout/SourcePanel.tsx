import { useEffect, useState } from "react";

import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import SourceCompare from "./SourceCompare";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useSourceGhost } from "../contexts/SourceGhostContext/useSourceGhost";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
}

/**
 * Right-dock Source section: a drag-to-compare viewer of the cached source
 * image vs the live sprite (what Generate produced and Resize & Process
 * re-consumes), ghost-overlay controls, and contextual actions. Shows a
 * generate CTA when no source exists (blank canvas / pasted sprite). There is
 * deliberately no "clear" action: dropping the source would disable free
 * re-processing.
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

  if (!sourceImage) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-surface p-4 text-center">
        <p className="text-xs leading-relaxed text-ink-subtle">
          No source image yet. Generate or upload one and it will appear here
          for tracing, comparing and re-processing.
        </p>
        <Button variant="primary" onClick={onOpenGenerate} className="gap-1.5">
          <span aria-hidden>✦</span> Generate
        </Button>
      </div>
    );
  }

  // Object URL not created yet (first frame after mount/source change).
  if (!sourceUrl) return null;

  return (
    <div className="space-y-3">
      {/* Drag-to-compare: original vs the live sprite */}
      <SourceCompare sourceUrl={sourceUrl} />

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
            aria-label="Opacity"
          />
        </div>
      </div>

      {/* Actions — stacked, full-width buttons (icon + label spaced by gap) */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={onOpenResize} className="gap-1.5">
          <span aria-hidden>⟲</span> Re-process
        </Button>
        <a
          href={sourceUrl}
          download={sourceImage.name}
          className="btn-outline gap-1.5 text-center">
          <span aria-hidden>⬇</span> Download
        </a>
      </div>
    </div>
  );
}
