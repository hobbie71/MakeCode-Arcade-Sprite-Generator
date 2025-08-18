import { CanvasProvider } from "../contexts/CanvasContext/CanvasContext";
import { ColorSelectedProvider } from "../contexts/ColorSelectedContext/ColorSelectedContext";
import { ToolSelectedProvider } from "../contexts/ToolSelectedContext/ToolSelectedContext";
import { ZoomProvider } from "../contexts/ZoomContext/ZoomContext";
import { SpriteProvider } from "../contexts/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "@/context/CanvasSizeContext/CanvasSizeContext";

const SpriteEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CanvasProvider>
      <CanvasSizeProvider>
        <ColorSelectedProvider>
          <ToolSelectedProvider>
            <ZoomProvider>
              <SpriteProvider>{children}</SpriteProvider>
            </ZoomProvider>
          </ToolSelectedProvider>
        </ColorSelectedProvider>
      </CanvasSizeProvider>
    </CanvasProvider>
  );
};

export default SpriteEditorProvider;
