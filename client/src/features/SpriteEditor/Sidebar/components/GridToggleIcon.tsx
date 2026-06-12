import { useGrid } from "../../contexts/GridContext/useGrid";
import IconButton from "../../../../components/IconButton";
import Tooltip from "../../../../components/Tooltip";
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

/**
 * Toggles the per-pixel grid overlay on the canvas. Matches the rest of the
 * left rail; gets the accent "active" treatment when the grid is shown
 * (default off). Shortcut: G.
 */
const GridToggleIcon = () => {
  const { showGrid, setShowGrid } = useGrid();

  const toggle = () => setShowGrid((v) => !v);

  const shortcut: KeyboardShortcut[] = [{ key: "g", callback: toggle }];
  useKeyboardShortcut(shortcut);

  return (
    <Tooltip text={showGrid ? "Hide grid" : "Show grid"} hotkey="G">
      <IconButton
        pressed={showGrid}
        onClick={toggle}
        aria-label={showGrid ? "Hide grid" : "Show grid"}>
        <i className="ms-Icon ms-Icon--GridViewSmall" aria-hidden="true" />
      </IconButton>
    </Tooltip>
  );
};

export default GridToggleIcon;
