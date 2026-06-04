import { useShapeMode } from "../contexts/ShapeModeContext/useShapeMode";

/**
 * Shape fill vs. outline for Rectangle/Circle. Wired to ShapeModeContext, which
 * the rectangle/circle tools (and their previews) read to draw filled vs. outline
 * shapes.
 */
export default function ShapeModeOption() {
  const { shapeMode, setShapeMode } = useShapeMode();
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs text-ink-subtle">Shape</span>
      {(["outline", "fill"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setShapeMode(m)}
          aria-pressed={shapeMode === m}
          className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
            shapeMode === m
              ? "bg-accent text-on-accent"
              : "text-ink-muted hover:bg-surface-hover"
          }`}>
          {m}
        </button>
      ))}
    </div>
  );
}
