// Provder imports
import SpriteEditorProvider from "./provider/SpriteEditorProviders";

// Component imports
import Canvas from "./components/Canvas";
import SideBar from "./Sidebar/Sidebar";
import SpriteDataResizer from "./components/SpriteDataResizer";

const SpriteEditor = () => {
  return (
    <SpriteEditorProvider>
      <div className="flex-1 flex flex-row rounded-3xl overflow-hidden bg-default-200 shadow-default-lg">
        <SideBar />
        <Canvas width={16} height={16} />
        <SpriteDataResizer />
      </div>
    </SpriteEditorProvider>
  );
};

export default SpriteEditor;
