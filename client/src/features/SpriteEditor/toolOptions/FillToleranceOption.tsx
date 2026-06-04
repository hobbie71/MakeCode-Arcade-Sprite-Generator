import { useFillOptions } from "../contexts/FillOptionsContext/useFillOptions";

/**
 * Fill spread for the bucket tool. Wired to FillOptionsContext. Because the
 * canvas is palette-indexed, this controls reach rather than color distance:
 * 0 = contiguous (4-connected), >0 bridges diagonal gaps (8-connected), 100 =
 * global same-color replace. (See FillOptionsContext.)
 */
export default function FillToleranceOption() {
  const { tolerance, setTolerance } = useFillOptions();
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
