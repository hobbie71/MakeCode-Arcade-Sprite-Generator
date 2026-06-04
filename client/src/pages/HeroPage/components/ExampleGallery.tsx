// Placeholder showcase tiles. Swap for real generated-sprite assets later;
// these stand-ins keep the layout honest without faking pixel art. The label +
// size-badge row mirrors the locked mockup (01-hero) so the swap is drop-in.
const EXAMPLES = [
  { label: "blue ninja warrior", color: "oklch(0.58 0.18 264)", size: "32×32" },
  { label: "green dungeon slime", color: "oklch(0.7 0.18 150)", size: "16×16" },
  { label: "spinning gold coin", color: "oklch(0.8 0.16 90)", size: "16×16" },
  { label: "health pickup heart", color: "oklch(0.62 0.2 25)", size: "16×16" },
  { label: "teal crystal gem", color: "oklch(0.7 0.13 200)", size: "16×16" },
  { label: "purple magic potion", color: "oklch(0.6 0.18 300)", size: "16×16" },
  { label: "power-up star", color: "oklch(0.82 0.15 85)", size: "16×16" },
  { label: "hero's short sword", color: "oklch(0.65 0.02 264)", size: "16×16" },
  { label: "spotted forest mushroom", color: "oklch(0.62 0.2 25)", size: "16×16" },
];

export default function ExampleGallery({
  onExplore,
}: {
  onExplore: () => void;
}) {
  return (
    <section id="gallery" className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-2xs font-semibold uppercase tracking-wide text-accent">
        Made with MakeSpriteCode
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 className="text-h2 font-bold text-ink">
          A gallery of generated sprites
        </h2>
        <button
          type="button"
          onClick={onExplore}
          className="btn-secondary px-4 py-2 text-sm">
          Explore the showcase →
        </button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {EXAMPLES.map(({ label, color, size }) => (
          <div
            key={label}
            className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-sm">
            <div className="transparent flex aspect-square items-center justify-center">
              <span
                className="h-10 w-10 rounded-sm shadow-sm"
                style={{ backgroundColor: color, imageRendering: "pixelated" }}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
              <span className="truncate font-mono text-xs text-ink-muted">
                {label}
              </span>
              <span className="shrink-0 font-mono text-2xs text-ink-subtle">
                {size}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
