import Button from "../../../components/Button";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import SizeMenu from "./SizeMenu";
import ZoomMenu from "./ZoomMenu";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

// Shared layout overrides for the three action pills: tighter padding on
// mobile, no wrapping, icon gap.
const PILL_CLASS = "gap-1.5 whitespace-nowrap px-2.5 sm:px-4";

/**
 * Floating actions over the canvas stage: the pixel-size menu (bottom-left, a
 * quick pick of common canvas sizes + Custom size…), the Generate / Resize /
 * Export pills (bottom-center), and the zoom menu (bottom-right).
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
  const { isGenerating } = useLoading();

  return (
    <>
      <SizeMenu onOpenCustom={onOpenResize} />

      <div
        data-fit-obstacle="bottom"
        className="absolute bottom-16 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-chip border border-line bg-surface-raised p-1.5 shadow-lg sm:bottom-4 sm:gap-2">
        <Button
          size="sm"
          onClick={onOpenGenerate}
          disabled={isGenerating}
          className={PILL_CLASS}>
          <span aria-hidden>✦</span>
          Generate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenResize}
          disabled={isGenerating}
          aria-label="Resize & Process"
          className={PILL_CLASS}>
          <span aria-hidden>⟲</span>
          {/* Full label from sm up; shortened on mobile to avoid wrapping. */}
          <span className="hidden sm:inline">Resize &amp; Process</span>
          <span className="sm:hidden">Resize</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenExport}
          className={PILL_CLASS}>
          <span aria-hidden>⎙</span>
          Export
        </Button>
      </div>

      <ZoomMenu />
    </>
  );
}
