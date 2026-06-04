import { useMemo } from "react";

import { useHistory } from "../contexts/HistoryContext/useHistory";
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import Tooltip from "../../../components/Tooltip";

/**
 * Undo / Redo controls, floating at the top-right of the canvas stage (see the
 * 04-studio mockup). Buttons reflect availability; keyboard shortcuts are wired
 * cross-platform: Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z and Cmd/Ctrl+Y = redo.
 */
export default function CanvasHistoryControls() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      // Undo — Cmd+Z (mac) / Ctrl+Z (win/linux), without Shift.
      { key: "z", meta: true, callback: () => undo() },
      { key: "z", ctrl: true, callback: () => undo() },
      // Redo — Cmd/Ctrl+Shift+Z.
      { key: "z", meta: true, shift: true, callback: () => redo() },
      { key: "z", ctrl: true, shift: true, callback: () => redo() },
      // Redo — Cmd/Ctrl+Y.
      { key: "y", meta: true, callback: () => redo() },
      { key: "y", ctrl: true, callback: () => redo() },
    ],
    [undo, redo]
  );
  useKeyboardShortcut(shortcuts);

  return (
    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-chip border border-line bg-surface-raised p-1 shadow-md">
      <Tooltip text="Undo" hotkey="⌘Z">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          className="flex h-8 w-8 items-center justify-center rounded text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40">
          <i className="ms-Icon ms-Icon--Undo" aria-hidden="true" />
        </button>
      </Tooltip>
      <Tooltip text="Redo" hotkey="⌘⇧Z">
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          className="flex h-8 w-8 items-center justify-center rounded text-ink transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40">
          <i className="ms-Icon ms-Icon--Redo" aria-hidden="true" />
        </button>
      </Tooltip>
    </div>
  );
}
