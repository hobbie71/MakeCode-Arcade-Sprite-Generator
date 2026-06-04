import { useState } from "react";

/**
 * STUB option: fill tolerance for the Fill (bucket) tool. UI only for now — not
 * yet wired into useFill; local state placeholder.
 */
export default function FillToleranceOption() {
  const [tolerance, setTolerance] = useState(0);
  return (
    <label className="flex items-center gap-2 text-xs text-ink-subtle">
      Tolerance
      <input
        type="range"
        min={0}
        max={100}
        value={tolerance}
        onChange={(e) => setTolerance(Number(e.target.value))}
        className="range-input h-1.5 w-28"
      />
      <span className="w-8 tabular-nums text-ink-muted">{tolerance}%</span>
    </label>
  );
}
