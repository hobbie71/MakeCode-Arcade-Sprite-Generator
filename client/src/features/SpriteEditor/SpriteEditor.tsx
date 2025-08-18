// Provder imports
import SpriteEditorProvider from "./provider/SpriteEditorProviders";

// Component imports
import Canvas from "./components/Canvas";
import SideBar from "./Sidebar/Sidebar";

const SpriteEditor = () => {
  return (
    <SpriteEditorProvider>
      <div className="sprite-editor-container relative flex flex-row">
        <SideBar />
        <Canvas width={16} height={16} />
      </div>
    </SpriteEditorProvider>
  );
};

export default SpriteEditor;
