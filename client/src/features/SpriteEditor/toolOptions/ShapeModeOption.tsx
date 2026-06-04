import { useState } from "react";

/**
 * STUB option: shape fill vs. outline for Rectangle/Circle. Renders the control
 * (demonstrating the contextual-options pattern) but is not yet wired into the
 * drawing hooks — local state only. Promote to a ShapeMode context when the
 * rectangle/circle tools support filled shapes.
 */
export default function ShapeModeOption() {
  const [mode, setMode] = useState<"outline" | "fill">("outline");
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-xs text-ink-subtle">Shape</span>
      {(["outline", "fill"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
            mode === m
              ? "bg-accent text-on-accent"
              : "text-ink-muted hover:bg-surface-hover"
          }`}>
          {m}
        </button>
      ))}
    </div>
  );
}
