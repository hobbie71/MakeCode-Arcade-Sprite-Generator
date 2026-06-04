import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import { useZoom } from "../contexts/ZoomContext/useZoom";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

function ActionPill({
  onClick,
  disabled,
  primary,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        primary
          ? "bg-accent text-on-accent shadow-accent hover:bg-accent-hover"
          : "bg-surface-raised text-ink hover:bg-surface-hover"
      }`}>
      {children}
    </button>
  );
}

/**
 * Floating actions over the canvas stage: the always-visible size chip
 * (bottom-left, opens Resize so a beginner can never get stuck), the Generate /
 * Resize / Export pills (bottom-center), and the zoom readout (bottom-right).
 */
export default function FloatingActionLayer({
  onOpenGenerate,
  onOpenResize,
  onOpenExport,
}: Props) {
  const { width, height } = useCanvasSize();
  const { sourceImage } = useImageImports();
  const { isGenerating } = useLoading();
  const { zoom } = useZoom();

  return (
    <>
      <button
        type="button"
        onClick={onOpenResize}
        disabled={isGenerating}
        aria-label="Canvas size — open Resize & Process"
        className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-pill border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink shadow-md transition-colors hover:bg-surface-hover disabled:opacity-50">
        <span aria-hidden>▦</span>
        {width} × {height}
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-pill border border-line bg-surface-raised/80 p-1.5 shadow-lg backdrop-blur-sm">
        <ActionPill primary onClick={onOpenGenerate} disabled={isGenerating}>
          ✦ Generate
        </ActionPill>
        <ActionPill
          onClick={onOpenResize}
          disabled={isGenerating || !sourceImage}>
          ⟲ Resize &amp; Process
        </ActionPill>
        <ActionPill onClick={onOpenExport}>⎙ Export</ActionPill>
      </div>

      <div className="absolute bottom-4 right-4 rounded-pill border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink-muted shadow-md">
        {Math.round(zoom * 100)}%
      </div>
    </>
  );
}
