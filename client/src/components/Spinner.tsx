type SpinnerProps = {
  /** Diameter + ring thickness. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-16 w-16 border-4",
} as const;

/**
 * Indeterminate loading spinner — an accent-colored ring with a transparent top
 * that rotates. Used for in-flight work (the global generation overlay, the
 * Resize & Process live-preview recompute, …).
 */
export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => (
  <div
    role="status"
    aria-label="Loading"
    className={`animate-spin rounded-full border-accent border-t-transparent ${SIZES[size]} ${className}`}
  />
);

export default Spinner;
