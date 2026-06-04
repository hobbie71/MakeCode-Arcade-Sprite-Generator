import { usePixelPerfect } from "../contexts/PixelPerfectContext/usePixelPerfect";

/**
 * "Pixel-perfect" stroke smoothing for the Pencil. Wired to PixelPerfectContext;
 * usePencil removes L-shaped corner pixels on diagonals when this is on (and the
 * brush size is 1).
 */
export default function PixelPerfectOption() {
  const { pixelPerfect, setPixelPerfect } = usePixelPerfect();
  return (
    <button
      type="button"
      onClick={() => setPixelPerfect((v) => !v)}
      aria-pressed={pixelPerfect}
      className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        pixelPerfect
          ? "bg-accent text-on-accent"
          : "text-ink-muted hover:bg-surface-hover"
      }`}>
      <span
        className={`inline-block h-3 w-3 rounded-sm border ${
          pixelPerfect ? "border-on-accent bg-on-accent" : "border-line"
        }`}
      />
      Pixel-perfect
    </button>
  );
}
