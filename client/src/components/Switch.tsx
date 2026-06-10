import { type ReactNode } from "react";

interface SwitchProps {
  /** Whether the switch is on. */
  checked: boolean;
  /** Called with the next state when the user flips it. */
  onChange: (next: boolean) => void;
  /** Text shown beside the switch. */
  label?: ReactNode;
  /** Classes for the label text — override to tune size/tone per context (e.g.
   *  "text-xs text-ink-subtle" to recede among muted toolbar labels). */
  labelClassName?: string;
  /** Dims the control and blocks interaction. */
  disabled?: boolean;
  /** Native tooltip — handy for explaining what the setting does. */
  title?: string;
  /** Accessible name when there is no string `label`. */
  ariaLabel?: string;
  /** Extra classes on the button — e.g. "w-full justify-between" to push the
   *  switch to the right edge of a settings row. */
  className?: string;
}

/**
 * The app's boolean on/off switch — a sliding track + thumb, the unmistakable
 * "this toggles" affordance. Use this for a binary setting that must read as a
 * control on its own (e.g. Pixel-perfect, Contiguous, Remove background). For an
 * either/or choice between named values use {@link SegmentedControl}; for an icon
 * on/off button in a toolbar or rail, a plain icon button is fine.
 *
 * The label is caller-styled via `labelClassName` (defaults to a solid body
 * label) so a switch can recede among muted labels or stand out in a card. Pass
 * `className="w-full justify-between"` to right-align the switch in a full-width row.
 */
export default function Switch({
  checked,
  onChange,
  label,
  labelClassName,
  disabled = false,
  title,
  ariaLabel,
  className = "",
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      title={title}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`group inline-flex items-center gap-2 font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {label != null && (
        <span className={`select-none ${labelClassName ?? "text-sm text-ink"}`}>
          {label}
        </span>
      )}
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors group-focus-visible:ring-2 group-focus-visible:ring-accent-ring ${
          checked ? "bg-accent" : "bg-surface-sunken"
        }`}>
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
