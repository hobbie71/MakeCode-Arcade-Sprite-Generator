interface Props {
  className?: string;
}

/**
 * Custom glyph for the Line tool: a single straight diagonal stroke, centred in
 * the viewBox. Uses `currentColor` so it inherits the rail button's text colour
 * — muted when idle, on-accent when active. Stroke weight is kept light to match
 * the sibling Fabric icons in the rail.
 */
const LineToolIcon = ({ className = "" }: Props) => (
  <svg
    className={`h-[18px] w-[18px] ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <line
      x1="5"
      y1="19"
      x2="19"
      y2="5"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default LineToolIcon;
