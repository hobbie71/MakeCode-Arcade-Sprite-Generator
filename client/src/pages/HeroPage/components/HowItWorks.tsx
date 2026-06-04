const STEPS = [
  {
    n: 1,
    title: "Describe or upload",
    body: "Type a prompt, drop in a photo, or start from a blank canvas at your target size.",
  },
  {
    n: 2,
    title: "Edit & refine",
    body: "Fine-tune every pixel on the Arcade palette, then re-process or resize for free.",
  },
  {
    n: 3,
    title: "Copy into MakeCode",
    body: "Copy the sprite as a MakeCode img literal and paste it straight into your game.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-center text-2xs font-semibold uppercase tracking-wide text-accent">
        How it works
      </p>
      <h2 className="mt-2 text-center text-h2 font-bold text-ink">
        From idea to game in three steps
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map(({ n, title, body }) => (
          <div
            key={n}
            className="rounded-card border border-line bg-surface-raised p-5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
              {n}
            </span>
            <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
