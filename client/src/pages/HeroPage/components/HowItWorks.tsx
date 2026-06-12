import type { ReactNode } from "react";

function SparkleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 3l1.8 4.6L18.5 9.4 13.8 11.2 12 16l-1.8-4.8L5.5 9.4 10.2 7.6 12 3zM18 14l.9 2.3L21 17.2l-2.1.9L18 20l-.9-2.1L15 17.2l2.1-.9L18 14z"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M5 15V5a2 2 0 012-2h10"
      />
    </svg>
  );
}

const STEPS: { n: string; title: string; body: string; icon: ReactNode }[] = [
  {
    n: "01",
    title: "Describe or upload",
    body: "Type a prompt and let AI draw it, or drop in your own image. Pick a size and asset type.",
    icon: <SparkleIcon />,
  },
  {
    n: "02",
    title: "Edit & refine",
    body: "Open the studio to nudge pixels, swap palette colors, resize, and clean up the background.",
    icon: <PencilIcon />,
  },
  {
    n: "03",
    title: "Copy into MakeCode",
    body: "Export the img code literal and paste it straight into MakeCode Arcade with Ctrl+V.",
    icon: <CopyIcon />,
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
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {STEPS.map(({ n, title, body, icon }) => (
          <div
            key={n}
            className="rounded-card border border-line bg-surface-raised p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-chip bg-accent-soft text-accent">
                {icon}
              </span>
              <span className="font-pixel text-base text-ink-subtle">{n}</span>
            </div>
            <h3 className="mt-5 text-h4 font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
