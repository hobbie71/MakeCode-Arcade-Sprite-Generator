import { useRef, type KeyboardEvent, type ReactNode } from "react";

export type SegmentOption<T> = {
  /** The value this segment selects. Compared against `value` with `===`. */
  value: T;
  /** Visible text. Omit for an icon-only segment (then set `ariaLabel`). */
  label?: ReactNode;
  /** Optional leading glyph (an `<i className="ms-Icon …" />` or an SVG). */
  icon?: ReactNode;
  /** Accessible name when there is no string `label` (icon-only segments). */
  ariaLabel?: string;
  /** Native tooltip — handy for icon-only segments. */
  title?: string;
  /** Dims and skips just this segment. */
  disabled?: boolean;
};

interface SegmentedControlProps<T> {
  /** The choices, rendered left to right. */
  options: SegmentOption<T>[];
  /** The currently selected value (matched against each option's `value`). */
  value: T;
  /** Called with the next value when the user picks a segment. */
  onChange: (value: T) => void;
  /** Leading label rendered outside the track (e.g. "Brush", "Shape"). When a
   *  string it also names the group for assistive tech. */
  label?: ReactNode;
  /** "md" (default) matches the generation tabs; "sm" is the compact size for
   *  the editor's tool-options strip. */
  size?: "sm" | "md";
  /** Segments stretch to fill the available width (flex-1) instead of hugging
   *  their content. The generation tabs use this; tool options do not. */
  stretch?: boolean;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Accessible name for the group when there is no visible `label`. */
  ariaLabel?: string;
  /** Extra classes merged onto the track container. */
  className?: string;
}

const SIZES = {
  sm: {
    segment: "rounded-md px-2 py-1 text-xs",
    label: "text-xs text-ink-subtle",
  },
  md: {
    segment: "rounded-[10px] px-2 py-1.5 text-sm sm:px-3",
    label: "text-sm text-ink-muted",
  },
} as const;

/**
 * The app's single-select segmented control: a row of mutually-exclusive
 * segments in a pill track, with the active segment lifted on a raised surface.
 * This is the default for any either/or choice between *named* values — brush
 * size, shape mode (outline/fill), the AI/Upload/Draw tabs, and so on. For a
 * binary on/off control use {@link Toggle} instead.
 *
 * Data-driven and keyed by value (not index), so it binds directly to enums,
 * number unions, and string unions. Segments are radio-group semantics with
 * roving focus and Arrow / Home / End keyboard navigation.
 */
export default function SegmentedControl<T>({
  options,
  value,
  onChange,
  label,
  size = "md",
  stretch = false,
  disabled = false,
  ariaLabel,
  className = "",
}: SegmentedControlProps<T>) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sz = SIZES[size];

  const selectedIndex = options.findIndex((o) => o.value === value);
  const firstEnabled = options.findIndex((o) => !o.disabled);
  const lastEnabled = options.reduce((last, o, i) => (o.disabled ? last : i), -1);
  // The single segment in the tab order (roving tabindex); falls back to the
  // first enabled one when `value` matches nothing so the group stays reachable.
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : firstEnabled;

  /** Next enabled index from `from` in `dir`, wrapping around. */
  const nextEnabled = (from: number, dir: 1 | -1): number => {
    const n = options.length;
    let i = from;
    for (let step = 0; step < n; step++) {
      i = (i + dir + n) % n;
      if (!options[i]?.disabled) return i;
    }
    return from;
  };

  const moveTo = (index: number) => {
    if (index < 0 || options[index]?.disabled) return;
    onChange(options[index].value);
    buttonsRef.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let target: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        target = nextEnabled(i, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        target = nextEnabled(i, -1);
        break;
      case "Home":
        target = firstEnabled;
        break;
      case "End":
        target = lastEnabled;
        break;
      default:
        return; // Space / Enter fall through to the button's native click.
    }
    event.preventDefault();
    moveTo(target);
  };

  const track = (
    <div
      role="radiogroup"
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      className={`flex gap-1 rounded-chip border border-line bg-surface p-1 ${className}`}>
      {options.map((opt, i) => {
        const active = i === selectedIndex;
        return (
          <button
            key={String(opt.value)}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={
              opt.ariaLabel ??
              (typeof opt.label === "string" ? opt.label : undefined)
            }
            title={opt.title}
            disabled={disabled || opt.disabled}
            tabIndex={i === tabbableIndex ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(event) => handleKeyDown(event, i)}
            className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring disabled:cursor-not-allowed disabled:opacity-50 ${
              sz.segment
            } ${stretch ? "flex-1" : ""} ${
              active
                ? "bg-surface-raised text-accent shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}>
            {opt.icon}
            {opt.label != null && <span className="select-none">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );

  if (label == null) return track;

  return (
    <div className="flex items-center gap-2">
      <span className={`font-medium ${sz.label}`}>{label}</span>
      {track}
    </div>
  );
}
