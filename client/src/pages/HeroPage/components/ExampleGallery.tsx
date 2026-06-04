// Placeholder showcase tiles. Swap for real generated-sprite assets later;
// these stand-ins keep the layout honest without faking pixel art.
const EXAMPLES = [
  { label: "Blue ninja", color: "oklch(0.58 0.18 264)" },
  { label: "Green slime", color: "oklch(0.7 0.18 150)" },
  { label: "Gold coin", color: "oklch(0.8 0.16 90)" },
  { label: "Red heart", color: "oklch(0.62 0.2 25)" },
  { label: "Crystal gem", color: "oklch(0.7 0.13 200)" },
  { label: "Potion", color: "oklch(0.6 0.18 300)" },
  { label: "Star", color: "oklch(0.82 0.15 85)" },
  { label: "Sword", color: "oklch(0.65 0.02 264)" },
];

export default function ExampleGallery() {
  return (
    <section id="gallery" className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-center text-2xs font-semibold uppercase tracking-wide text-accent">
        Made with MakeSpriteCode
      </p>
      <h2 className="mt-2 text-center text-h2 font-bold text-ink">
        A gallery of generated sprites
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {EXAMPLES.map(({ label, color }) => (
          <div
            key={label}
            className="rounded-card border border-line bg-surface-raised p-3 shadow-sm">
            <div className="transparent flex aspect-square items-center justify-center rounded-md">
              <span
                className="h-10 w-10 rounded-sm shadow-sm"
                style={{ backgroundColor: color, imageRendering: "pixelated" }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-center text-xs text-ink-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
