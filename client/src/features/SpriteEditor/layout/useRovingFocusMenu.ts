import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useCloseOnOutsideClick } from "../../../hooks/useCloseOnOutsideClick";

interface RovingFocusMenuOptions {
  /** Number of focusable items in the open menu. */
  itemCount: number;
  /** Item focused when the menu opens (e.g. the active row/swatch); clamped to 0. */
  initialIndex: number;
  /** Grid columns. 1 is a vertical list; >1 enables Left/Right and Up/Down by row. */
  columns?: number;
}

/**
 * Shared open/close + roving-focus keyboard plumbing behind the editor's popover
 * menus (the zoom/size {@link PopoverMenu} list and the {@link ColorMenu} colour
 * grid). Owns the open state, outside-click + Escape dismissal, focus-into-menu
 * on open / focus-back-to-trigger on close, and wraparound Arrow/Home/End nav.
 * Callers wire `itemRefs` onto each item and `handleItemKeyDown` onto its keydown.
 */
export function useRovingFocusMenu({
  itemCount,
  initialIndex,
  columns = 1,
}: RovingFocusMenuOptions) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useCloseOnOutsideClick(rootRef, open, () => setOpen(false));

  // On open, move focus into the menu (the active item, or the first one).
  useEffect(() => {
    if (!open) return;
    itemRefs.current[initialIndex >= 0 ? initialIndex : 0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const focusItem = useCallback(
    (index: number) => {
      if (itemCount === 0) return;
      itemRefs.current[((index % itemCount) + itemCount) % itemCount]?.focus();
    },
    [itemCount]
  );

  const handleItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const actions: Record<string, () => void> = {
        ArrowDown: () => focusItem(index + columns),
        ArrowUp: () => focusItem(index - columns),
        Home: () => focusItem(0),
        End: () => focusItem(itemCount - 1),
        Escape: () => close(),
        Tab: () => close(false),
      };
      // Left/Right only navigate a true grid; a 1-column list leaves them alone.
      if (columns > 1) {
        actions.ArrowRight = () => focusItem(index + 1);
        actions.ArrowLeft = () => focusItem(index - 1);
      }

      const action = actions[e.key];
      if (!action) return;
      // Tab must keep moving focus out of the menu, so it isn't prevented.
      if (e.key !== "Tab") e.preventDefault();
      action();
    },
    [close, columns, focusItem, itemCount]
  );

  return {
    open,
    setOpen,
    close,
    rootRef,
    triggerRef,
    itemRefs,
    handleItemKeyDown,
  };
}
