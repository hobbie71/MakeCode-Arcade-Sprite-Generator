import { EXAMPLES } from "./examples.data";
import GallerySprite from "./GallerySprite";

export default function ExampleGallery() {
  return (
    <section id="gallery" className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-2xs font-semibold uppercase tracking-wide text-accent">
        Made with MakeSpriteCode
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 className="text-h2 font-bold text-ink">
          A gallery of generated sprites
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {EXAMPLES.map(({ label, literal, size }) => (
          <div
            key={label}
            className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-sm"
          >
            <div className="flex aspect-square items-center justify-center p-5">
              <GallerySprite literal={literal} label={label} size={size} />
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
