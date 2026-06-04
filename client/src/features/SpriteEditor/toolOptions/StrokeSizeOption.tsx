import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { STROKE_SIZES } from "../../../types/pixel";

/** Real option: brush/stroke size (moved out of the old Sidebar StrokeIcons). */
export default function StrokeSizeOption() {
  const { strokeSize, setStrokeSize } = useStrokeSize();
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs text-ink-subtle">Brush</span>
      {STROKE_SIZES.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => setStrokeSize(size)}
          aria-pressed={strokeSize === size}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            strokeSize === size
              ? "bg-accent text-on-accent"
              : "text-ink-muted hover:bg-surface-hover"
          }`}>
          {size}px
        </button>
      ))}
    </div>
  );
}
