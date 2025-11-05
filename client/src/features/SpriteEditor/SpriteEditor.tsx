// Provder imports
import SpriteEditorProvider from "./provider/SpriteEditorProviders";

// Component imports
import Canvas from "./components/Canvas";
import SideBar from "./Sidebar/Sidebar";
import SpriteDataResizer from "./components/SpriteDataResizer";

// Hook imports
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { useToolSelected } from "./contexts/ToolSelectedContext/useToolSelected";

// Type imports
import { ALL_EDITOR_TOOLS } from "../../types/tools";
import { type KeyboardShortcut } from "../../hooks/useKeyboardShortcut";

const SpriteEditorContent = () => {
  const { setTool } = useToolSelected();

  // Create all tool shortcuts
  const shortcuts: KeyboardShortcut[] = ALL_EDITOR_TOOLS.map((t) => ({
    key: t.shortcut,
    callback: () => setTool(t.tool),
  }));
  useKeyboardShortcut(shortcuts);

  return (
    <div className="flex-1 flex flex-row rounded-3xl bg-default-200 shadow-default-lg">
      <SideBar />
      <Canvas width={16} height={16} />
      <SpriteDataResizer />
    </div>
  );
};

const SpriteEditor = () => {
  return (
    <SpriteEditorProvider>
      <SpriteEditorContent />
    </SpriteEditorProvider>
  );
};

export default SpriteEditor;
