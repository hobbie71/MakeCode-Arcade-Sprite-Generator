import { useMemo } from "react";

import { useSelection } from "../contexts/SelectionContext/useSelection";
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../hooks/useKeyboardShortcut";

/** Shift+Arrow nudges by a bigger step (plain arrows move 1px). */
const BIG_NUDGE = 8;

/**
 * Logic-only keyboard wiring for the selection system. All bindings gate on
 * the selection phase inside their callbacks (with preventDefault deferred
 * until handled) so arrows/Enter/Esc/Delete stay inert — and pages keep
 * scrolling — when nothing is selected.
 */
export default function SelectionShortcuts() {
  const {
    phase,
    cancelFloating,
    clearSelection,
    commitFloating,
    deleteSelection,
    nudge,
  } = useSelection();

  const shortcuts: KeyboardShortcut[] = useMemo(() => {
    const active = phase === "selected" || phase === "floating";

    const arrow =
      (dx: number, dy: number) =>
      (event: KeyboardEvent): void => {
        if (!active) return;
        event.preventDefault();
        nudge(dx, dy);
      };

    const arrows: KeyboardShortcut[] = (
      [
        ["arrowleft", -1, 0],
        ["arrowright", 1, 0],
        ["arrowup", 0, -1],
        ["arrowdown", 0, 1],
      ] as const
    ).flatMap(([key, dx, dy]) => [
      { key, preventDefault: false, callback: arrow(dx, dy) },
      {
        key,
        shift: true,
        preventDefault: false,
        callback: arrow(dx * BIG_NUDGE, dy * BIG_NUDGE),
      },
    ]);

    return [
      {
        key: "escape",
        preventDefault: false,
        callback: (event) => {
          if (phase === "floating") {
            event.preventDefault();
            cancelFloating();
          } else if (phase !== "idle") {
            event.preventDefault();
            clearSelection();
          }
        },
      },
      {
        key: "enter",
        preventDefault: false,
        callback: (event) => {
          if (phase !== "floating") return;
          event.preventDefault();
          commitFloating();
        },
      },
      ...(["delete", "backspace"] as const).map(
        (key): KeyboardShortcut => ({
          key,
          preventDefault: false,
          callback: (event) => {
            if (!active) return;
            event.preventDefault();
            deleteSelection();
          },
        })
      ),
      ...arrows,
    ];
  }, [phase, cancelFloating, clearSelection, commitFloating, deleteSelection, nudge]);

  useKeyboardShortcut(shortcuts);

  return null;
}
