import { useCallback, useMemo } from "react";

import { useHistory } from "../contexts/HistoryContext/useHistory";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import IconButton from "../../../components/IconButton";
import Tooltip from "../../../components/Tooltip";

/**
 * Undo / Redo controls, floating at the top-right of the canvas stage (see the
 * 04-studio mockup). Buttons reflect availability; keyboard shortcuts are wired
 * cross-platform: Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z and Cmd/Ctrl+Y = redo.
 */
export default function CanvasHistoryControls() {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { phase, cancelFloating } = useSelection();

  // Undo/redo while a selection is floating first cancels the float (pixels
  // snap home) instead of walking history — the float isn't IN history yet,
  // so stepping past it would desync the snapshot stack (ADR-0007).
  const guardedUndo = useCallback(() => {
    if (phase === "floating") {
      cancelFloating();
      return;
    }
    undo();
  }, [phase, cancelFloating, undo]);

  const guardedRedo = useCallback(() => {
    if (phase === "floating") {
      cancelFloating();
      return;
    }
    redo();
  }, [phase, cancelFloating, redo]);

  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      // Undo — Cmd+Z (mac) / Ctrl+Z (win/linux), without Shift.
      { key: "z", meta: true, callback: () => guardedUndo() },
      { key: "z", ctrl: true, callback: () => guardedUndo() },
      // Redo — Cmd/Ctrl+Shift+Z.
      { key: "z", meta: true, shift: true, callback: () => guardedRedo() },
      { key: "z", ctrl: true, shift: true, callback: () => guardedRedo() },
      // Redo — Cmd/Ctrl+Y.
      { key: "y", meta: true, callback: () => guardedRedo() },
      { key: "y", ctrl: true, callback: () => guardedRedo() },
    ],
    [guardedUndo, guardedRedo]
  );
  useKeyboardShortcut(shortcuts);

  return (
    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-chip border border-line bg-surface-raised p-1 shadow-md">
      <Tooltip text="Undo" hotkey="⌘Z" placement="bottom">
        <IconButton onClick={guardedUndo} disabled={!canUndo} aria-label="Undo">
          <i className="ms-Icon ms-Icon--Undo" aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Tooltip text="Redo" hotkey="⌘⇧Z" placement="bottom">
        <IconButton onClick={guardedRedo} disabled={!canRedo} aria-label="Redo">
          <i className="ms-Icon ms-Icon--Redo" aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
