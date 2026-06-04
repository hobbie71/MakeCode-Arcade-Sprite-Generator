import { useState } from "react";

/**
 * STUB option: "pixel-perfect" stroke smoothing for the Pencil. UI only for now —
 * not yet wired into usePencil; local state placeholder.
 */
export default function PixelPerfectOption() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        on ? "bg-accent text-on-accent" : "text-ink-muted hover:bg-surface-hover"
      }`}>
      <span
        className={`inline-block h-3 w-3 rounded-sm border ${
          on ? "border-on-accent bg-on-accent" : "border-line"
        }`}
      />
      Pixel-perfect
    </button>
  );
}
