import { useGrid } from "../../contexts/GridContext/useGrid";
import Tooltip from "../../../../components/Tooltip";
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

/**
 * Toggles the per-pixel grid overlay on the canvas. Tool-button styled so it
 * matches the rest of the left rail; gets the accent "active" treatment when the
 * grid is shown (default on). Shortcut: G.
 */
const GridToggleIcon = () => {
  const { showGrid, setShowGrid } = useGrid();

  const toggle = () => setShowGrid((v) => !v);

  const shortcut: KeyboardShortcut[] = [{ key: "g", callback: toggle }];
  useKeyboardShortcut(shortcut);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        toggle();
        break;
      default:
        break;
    }
  };

  return (
    <Tooltip text={showGrid ? "Hide grid" : "Show grid"} hotkey="G">
      <button
        className={`tool-button ${showGrid ? "active" : ""}`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-label={showGrid ? "Hide grid" : "Show grid"}
        aria-pressed={showGrid}
        role="button"
        type="button"
        tabIndex={0}>
        <i className="ms-Icon ms-Icon--GridViewSmall" aria-hidden="true" />
      </button>
    </Tooltip>
  );
};

export default GridToggleIcon;
