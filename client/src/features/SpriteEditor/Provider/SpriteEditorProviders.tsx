import { CanvasProvider } from "../contexts/CanvasContext/CanvasContext";
import { ColorSelectedProvider } from "../contexts/ColorSelectedContext/ColorSelectedContext";
import { ToolSelectedProvider } from "../contexts/ToolSelectedContext/ToolSelectedContext";
import { ZoomProvider } from "../contexts/ZoomContext/ZoomContext";

const SpriteEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CanvasProvider>
      <ColorSelectedProvider>
        <ToolSelectedProvider>
          <ZoomProvider>{children}</ZoomProvider>
        </ToolSelectedProvider>
      </ColorSelectedProvider>
    </CanvasProvider>
  );
};

export default SpriteEditorProvider;
