// Component imports
import ToolIcon from "./ToolIcon";

// Hook imports
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import { useToolSelected } from "../../contexts/ToolSelectedContext/useToolSelected";

// Type imports
import { ALL_EDITOR_TOOLS } from "../../../../types/tools";
import { type KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

const ToolIcons = () => {
  const { setTool } = useToolSelected();

  const shortcuts: KeyboardShortcut[] = ALL_EDITOR_TOOLS.map((t) => ({
    key: t.shortcut,
    callback: () => setTool(t.tool),
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
