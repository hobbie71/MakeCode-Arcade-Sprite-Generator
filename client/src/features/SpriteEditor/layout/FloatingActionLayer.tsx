import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import ZoomMenu from "./ZoomMenu";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

function ActionPill({
  onClick,
  disabled,
  primary,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-chip px-2.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 ${
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
 *
 * On small screens the center action cluster lifts to its own row (`bottom-16`)
 * so it never overlaps the corner chips; labels collapse to keep each control on
 * a single line. From `sm` up everything sits on one row at `bottom-4`.
 */
export default function FloatingActionLayer({
  onOpenGenerate,
  onOpenResize,
  onOpenExport,
}: Props) {
  const { width, height } = useCanvasSize();
  const { sourceImage } = useImageImports();
  const { isGenerating } = useLoading();

  return (
    <>
      <button
        type="button"
        onClick={onOpenResize}
        disabled={isGenerating}
        aria-label="Canvas size — open Resize & Process"
        className="absolute bottom-4 left-4 flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink shadow-md transition-colors hover:bg-surface-hover disabled:opacity-50">
        <span aria-hidden>▦</span>
        {width} × {height}
      </button>

      <div
        data-fit-obstacle="bottom"
        className="absolute bottom-16 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-chip border border-line bg-surface-raised/80 p-1.5 shadow-lg backdrop-blur-sm sm:bottom-4 sm:gap-2">
        <ActionPill primary onClick={onOpenGenerate} disabled={isGenerating}>
          <span aria-hidden>✦</span>
          Generate
        </ActionPill>
        <ActionPill
          onClick={onOpenResize}
          disabled={isGenerating || !sourceImage}
          ariaLabel="Resize & Process">
          <span aria-hidden>⟲</span>
          {/* Full label from sm up; shortened on mobile to avoid wrapping. */}
          <span className="hidden sm:inline">Resize &amp; Process</span>
          <span className="sm:hidden">Resize</span>
        </ActionPill>
        <ActionPill onClick={onOpenExport}>
          <span aria-hidden>⎙</span>
          Export
        </ActionPill>
      </div>

      <ZoomMenu />
    </>
  );
}
