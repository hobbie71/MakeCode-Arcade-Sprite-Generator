interface Props {
  className?: string;
}

/**
 * Inline outline glyphs for the right-dock tabs (Palette, Source, Layers,
 * Animation, History). Drawn inline rather than via Fabric MDL2 so they match
 * the redesign's lucide-style stroke set — the Fabric build in index.html has no
 * matching film/layers/palette outlines. Stroked with `currentColor` so they
 * pick up the tab's text colour (muted when idle, accent when active); sized
 * 16px for the dock tab buttons. Same inline-SVG pattern as SelectionActionIcons.
 */

const base = "h-5 w-5";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const PaletteIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    {...stroke}
    aria-hidden="true">
    <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.05-2.5 5.55-5.55 5.55h-1.96a1.64 1.64 0 0 0-1.16 2.81c.3.3.47.7.47 1.13C13.8 21.4 13 22 12 22Z" />
    <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="17" cy="13" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="7" cy="13" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const SourceIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    {...stroke}
    aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.8" />
    <path d="m21 15-4.1-4.1a2 2 0 0 0-2.8 0L5 20" />
  </svg>
);

export const LayersIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    {...stroke}
    aria-hidden="true">
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m2.6 12.08 8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9" />
    <path d="m2.6 16.08 8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9" />
  </svg>
);

export const AnimationIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    {...stroke}
    aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M3 7.5h4" />
    <path d="M17 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 16.5h4" />
  </svg>
);

export const HistoryIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    {...stroke}
    aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
