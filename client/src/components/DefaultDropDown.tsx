import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/**
 * Option shape: every option needs a `name` (the label / type-ahead key) plus
 * whatever payload `T` the caller threads through (e.g. `{ type }`, `{ quality }`,
 * `{ palette }`). The three presentational fields are optional, so a plain
 * label-only dropdown (Quality) and a rich icon+subtitle one (Asset type) share
 * the same component.
 */
type DropdownOption<T> = {
  name: string;
  /** Subtitle rendered under the name (e.g. "16×16 character or object"). */
  description?: string;
  /** Leading glyph, shown in a rounded tile (accent-tinted when selected). */
  icon?: ReactNode;
  /** Leading colour preview (palette dropdowns) — rendered as a small mosaic. */
  swatches?: string[];
} & T;

interface DefaultDropDownProps<T> {
  options: DropdownOption<T>[];
  /** Index of the selected option. -1 is tolerated (falls back to a placeholder). */
  value: number;
  onChange: (index: number) => void;
  /** Visible label text. Renders a <label>; omit it and pass `ariaLabel` instead. */
  children?: string;
  /** Accessible name when there is no visible label (e.g. the Studio dock). */
  ariaLabel?: string;
  /** Extra classes merged onto the trigger button (sizing, min-width, …). */
  className?: string;
  disabled?: boolean;
  /** Stack the label above the trigger (a column) instead of the default
   *  label-left / control-right row. Used where the dropdown sits in a
   *  side-by-side field layout (e.g. Asset type beside Size). */
  stacked?: boolean;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 ${
      open ? "rotate-90" : ""
    }`}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <path
      d="m6 8 4 4 4-4"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-[18px] w-[18px] shrink-0 text-accent"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    aria-hidden="true">
    <path
      d="m5 10.5 3.5 3.5L15 7"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Small colour mosaic used as a palette option's leading preview. */
const SwatchTile = ({ colors }: { colors: string[] }) => (
  <span className="grid h-9 w-9 shrink-0 grid-cols-3 grid-rows-2 overflow-hidden rounded-chip border border-line">
    {colors.slice(0, 6).map((hex, i) => (
      <span key={i} style={{ backgroundColor: hex }} aria-hidden="true" />
    ))}
  </span>
);

const DefaultDropDown = <T,>({
  options,
  value,
  onChange,
  children,
  ariaLabel,
  className = "",
  disabled = false,
  stacked = false,
}: DefaultDropDownProps<T>) => {
  const [open, setOpen] = useState(false);
  // `activeIndex` is the keyboard-highlighted row while the list is open; it is
  // distinct from `value` (the committed selection) until the user confirms.
  const [activeIndex, setActiveIndex] = useState(value >= 0 ? value : 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeAheadBuffer = useRef("");
  const typeAheadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const labelId = useId();
  const buttonId = useId();
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const selected = options[value];

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(value >= 0 ? value : 0);
    setOpen(true);
  };

  const commit = (index: number) => {
    if (disabled) return;
    onChange(index);
    closeMenu();
  };

  // Focus the listbox when it opens so it receives keyboard events.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the active row scrolled into view as it moves.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Clear any pending type-ahead timer on unmount.
  useEffect(
    () => () => {
      if (typeAheadTimeout.current) clearTimeout(typeAheadTimeout.current);
    },
    []
  );

  const handleTypeAhead = (char: string) => {
    if (typeAheadTimeout.current) clearTimeout(typeAheadTimeout.current);
    typeAheadBuffer.current += char.toLowerCase();
    const match = options.findIndex((option) =>
      option.name.toLowerCase().startsWith(typeAheadBuffer.current)
    );
    if (match !== -1) setActiveIndex(match);
    typeAheadTimeout.current = setTimeout(() => {
      typeAheadBuffer.current = "";
    }, 500);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        event.preventDefault();
        openMenu();
        break;
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu();
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey
        ) {
          event.preventDefault();
          handleTypeAhead(event.key);
        }
    }
  };

  return (
    <div
      ref={containerRef}
      className={
        children ? (stacked ? "flex flex-col gap-1.5" : "input-group") : ""
      }>
      {children && (
        <label
          id={labelId}
          htmlFor={buttonId}
          className="block text-sm font-medium text-ink-muted">
          {children}
        </label>
      )}

      <div className={`relative ${stacked ? "w-full" : ""}`}>
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          disabled={disabled}
          onClick={() => (open ? closeMenu(false) : openMenu())}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={children ? labelId : undefined}
          aria-label={children ? undefined : ariaLabel}
          /* Uses the SAME `form-input` class as the Size inputs so the box —
             border, radius, shadow, bg, font, padding, hover, focus — is
             identical by construction. `border-solid` is required because a
             <button> defaults to border-style:none (which zeroes the width);
             the only intentional additions are the flex layout for the chevron,
             the adaptive width, and the open-state accent ring. */
          className={`form-input flex items-center justify-between gap-2 border-solid px-3 py-2 text-left font-medium ${
            stacked ? "w-full" : "w-auto min-w-[7rem] max-w-[16rem]"
          } ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${open ? "border-accent ring-2 ring-accent-ring" : ""} ${className}`}>
          <span className="min-w-0 flex-1 truncate">
            {selected ? selected.name : (ariaLabel ?? "Select…")}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={children ? labelId : undefined}
            aria-label={children ? undefined : ariaLabel}
            aria-activedescendant={optionId(activeIndex)}
            onKeyDown={handleListKeyDown}
            className={`absolute top-full z-50 mt-1.5 max-h-72 w-max min-w-full max-w-[20rem] overflow-auto rounded-card border border-line bg-surface-raised p-1.5 shadow-lg focus:outline-none ${
              stacked ? "left-0" : "right-0"
            }`}>
            {options.map((option, index) => {
              const isSelected = index === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.name}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center gap-3 rounded-chip px-2.5 py-2 ${
                    isActive ? "bg-surface-hover" : ""
                  }`}>
                  {option.icon && (
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-chip ${
                        isSelected
                          ? "bg-accent-soft text-accent"
                          : "bg-surface-sunken text-ink-muted"
                      }`}>
                      {option.icon}
                    </span>
                  )}
                  {!option.icon && option.swatches && (
                    <SwatchTile colors={option.swatches} />
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm ${
                        isSelected
                          ? "font-semibold text-accent"
                          : "font-medium text-ink"
                      }`}>
                      {option.name}
                    </span>
                    {option.description && (
                      <span className="mt-0.5 block truncate text-xs text-ink-muted">
                        {option.description}
                      </span>
                    )}
                  </span>

                  {isSelected && <CheckIcon />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DefaultDropDown;
