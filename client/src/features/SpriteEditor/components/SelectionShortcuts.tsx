import { useMemo } from "react";

import { useSelection } from "../contexts/SelectionContext/useSelection";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";
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
    selectAll,
    invertSelection,
    copySelection,
    cutSelection,
  } = useSelection();
  const { tool, setTool } = useToolSelected();

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
      // Select All — Cmd/Ctrl+A — selects the whole canvas and arms Select.
      ...(["meta", "ctrl"] as const).map(
        (m): KeyboardShortcut => ({
          key: "a",
          [m]: true,
          callback: () => {
            selectAll();
            if (tool !== EditorTools.Select) setTool(EditorTools.Select);
          },
        })
      ),
      // Invert Selection — Cmd/Ctrl+Shift+I.
      ...(["meta", "ctrl"] as const).map(
        (m): KeyboardShortcut => ({
          key: "i",
          shift: true,
          [m]: true,
          preventDefault: false,
          callback: (event) => {
            if (phase === "idle" && tool !== EditorTools.Select) return;
            event.preventDefault();
            invertSelection();
          },
        })
      ),
      // Copy / Cut — Cmd/Ctrl+C / X — only when a selection exists, so plain
      // copy/cut keeps working elsewhere.
      ...(["meta", "ctrl"] as const).flatMap((m): KeyboardShortcut[] => [
        {
          key: "c",
          [m]: true,
          preventDefault: false,
          callback: (event) => {
            if (!active) return;
            event.preventDefault();
            copySelection();
          },
        },
        {
          key: "x",
          [m]: true,
          preventDefault: false,
          callback: (event) => {
            if (!active) return;
            event.preventDefault();
            cutSelection();
          },
        },
      ]),
    ];
  }, [
    phase,
    tool,
    setTool,
    cancelFloating,
    clearSelection,
    commitFloating,
    deleteSelection,
    nudge,
    selectAll,
    invertSelection,
    copySelection,
    cutSelection,
  ]);

  useKeyboardShortcut(shortcuts);

  return null;
}
