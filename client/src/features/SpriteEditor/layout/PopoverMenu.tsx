import { useState, useRef, useEffect, useCallback } from "react";

import { useCloseOnOutsideClick } from "../../../hooks/useCloseOnOutsideClick";

export type PopoverMenuItem = {
  key: string;
  label: React.ReactNode;
  onSelect: () => void;
  /** Marks the current value — rendered with a ✓ and exposed as aria-checked. */
  selected?: boolean;
};

interface PopoverMenuProps {
  /** Accessible name for the trigger (e.g. "Zoom level", "Canvas size"). */
  ariaLabel: string;
  /** Content of the trigger pill (e.g. "181%" or "16 × 16"). */
  trigger: React.ReactNode;
  /** Preset choices, rendered as a radio group (mutually exclusive). */
  items: PopoverMenuItem[];
  /** Optional action rendered below a divider (e.g. "Fit to screen"). */
  footer?: PopoverMenuItem;
  /** Which edge the popover aligns to. Defaults to "right". */
  align?: "left" | "right";
  /** Positioning classes for the (positioned) root, e.g. "absolute bottom-4 left-4". */
  className?: string;
}

/**
 * A floating pill control that opens an upward popover menu of choices — the
 * shared shape behind the canvas zoom and pixel-size controls. Owns open/close,
 * outside-click + Escape, and full menu keyboard support: focus moves into the
 * menu on open and back to the trigger on close, with Arrow / Home / End to move
 * between rows. The trigger uses the squared `rounded-chip` radius so it matches
 * the rest of the editor chrome rather than reading as an oval.
 */
export default function PopoverMenu({
  ariaLabel,
  trigger,
  items,
  footer,
  align = "right",
  className = "relative",
}: PopoverMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Flattened, ordered rows (presets then footer) — keyboard navigation treats
  // them as one sequence even though a divider sits between.
  const rows = footer ? [...items, footer] : items;

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useCloseOnOutsideClick(rootRef, open, () => setOpen(false));

  // On open, move focus to the selected row (or the first one).
  useEffect(() => {
    if (!open) return;
    const selectedIndex = rows.findIndex((r) => r.selected);
    itemRefs.current[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const focusRow = (index: number) => {
    const count = rows.length;
    itemRefs.current[((index % count) + count) % count]?.focus();
  };

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusRow(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusRow(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusRow(0);
        break;
      case "End":
        e.preventDefault();
        focusRow(rows.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const renderRow = (item: PopoverMenuItem, index: number, isFooter: boolean) => (
    <button
      key={item.key}
      ref={(el) => {
        itemRefs.current[index] = el;
      }}
      type="button"
      role={isFooter ? "menuitem" : "menuitemradio"}
      aria-checked={isFooter ? undefined : !!item.selected}
      tabIndex={-1}
      onClick={() => {
        item.onSelect();
        close();
      }}
      onKeyDown={(e) => handleItemKeyDown(e, index)}
      className="flex w-full items-center justify-between rounded-chip px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none">
      <span>{item.label}</span>
      {!isFooter && item.selected && <span aria-hidden>✓</span>}
    </button>
  );

  return (
    <div ref={rootRef} className={className}>
      {open && (
        <div
          role="menu"
          aria-label={ariaLabel}
          className={`absolute bottom-full ${
            align === "left" ? "left-0" : "right-0"
          } mb-2 max-h-[70vh] w-40 overflow-y-auto rounded-card border border-line bg-surface-raised p-1 shadow-lg`}>
          {items.map((item, i) => renderRow(item, i, false))}
          {footer && (
            <>
              <div className="my-1 border-t border-line" />
              {renderRow(footer, items.length, true)}
            </>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="whitespace-nowrap rounded-chip border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink-muted shadow-md transition-colors hover:bg-surface-hover">
        {trigger}
      </button>
    </div>
  );
}
