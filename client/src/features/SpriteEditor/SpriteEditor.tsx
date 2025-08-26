// Provder imports
import SpriteEditorProvider from "./provider/SpriteEditorProviders";

// Component imports
import Canvas from "./components/Canvas";
import SideBar from "./Sidebar/Sidebar";
import SpriteDataResizer from "./components/SpriteDataResizer";

const SpriteEditor = () => {
  return (
    <SpriteEditorProvider>
      <div className="sprite-editor-container relative flex flex-row">
        <SideBar />
        <Canvas width={16} height={16} />
        <SpriteDataResizer />
      </div>
    </SpriteEditorProvider>
  );
};

export default SpriteEditor;
