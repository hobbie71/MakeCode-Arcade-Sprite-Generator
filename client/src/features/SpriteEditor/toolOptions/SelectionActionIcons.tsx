interface Props {
  className?: string;
}

/**
 * Inline SVG glyphs for the selection Flip/Rotate actions. The Fabric MDL2
 * build loaded in index.html does NOT ship FlipHorizontal/FlipVertical or
 * directional-rotate icons (they render as empty boxes), so these are drawn
 * inline. Filled with `currentColor` to match the surrounding Fabric glyphs;
 * sized 16px for the small icon buttons. Paths are the Material "flip" and
 * "rotate_left/right" glyphs (flip-vertical is the flip glyph turned 90°).
 */

const base = "h-4 w-4";

export const FlipHorizontalIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z" />
  </svg>
);

export const FlipVerticalIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <g transform="rotate(90 12 12)">
      <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z" />
    </g>
  </svg>
);

export const RotateLeftIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z" />
  </svg>
);

export const RotateRightIcon = ({ className = "" }: Props) => (
  <svg
    className={`${base} ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z" />
  </svg>
);
