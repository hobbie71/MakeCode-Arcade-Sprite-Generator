// Component imports
import ToolIcon from "./ToolIcon";

// Hook imports
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import { useToolSelected } from "../../contexts/ToolSelectedContext/useToolSelected";
import { useSelectOptions } from "../../contexts/SelectOptionsContext/useSelectOptions";

// Type imports
import { ALL_EDITOR_TOOLS, EditorTools } from "../../../../types/tools";
import { type KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import type { SelectionMode } from "../../contexts/SelectOptionsContext/SelectOptionsContext";

/** Order the S shortcut cycles through. */
const SELECTION_MODE_CYCLE: SelectionMode[] = ["rectangle", "wand", "lasso"];

const ToolIcons = () => {
  const { tool, setTool } = useToolSelected();
  const { setMode } = useSelectOptions();

  const shortcuts: KeyboardShortcut[] = ALL_EDITOR_TOOLS.map((t) => ({
    key: t.shortcut,
    callback: () => {
      // Pressing S while Select is already active cycles the selection mode
      // (Rect → Wand → …) instead of re-selecting the tool.
      if (t.tool === EditorTools.Select && tool === EditorTools.Select) {
        setMode((prev) => {
          const i = SELECTION_MODE_CYCLE.indexOf(prev);
          return SELECTION_MODE_CYCLE[(i + 1) % SELECTION_MODE_CYCLE.length];
        });
        return;
      }
      setTool(t.tool);
    },
  }));

  useKeyboardShortcut(shortcuts);

  return (
    <>
      {ALL_EDITOR_TOOLS.map(({ tool, icon }, i) => (
        <ToolIcon key={i} tool={tool} icon={icon} />
      ))}
    </>
  );
};

export default ToolIcons;
