import { ColorSelectedProvider } from "../contexts/ColorSelectedContext/ColorSelectedContext";
import { ToolSelectedProvider } from "../contexts/ToolSelectedContext/ToolSelectedContext";
import { ZoomProvider } from "../contexts/ZoomContext/ZoomContext";
import { SelectionAreaProvider } from "../contexts/SelectionArea/SelectionAreaContext";
import { MouseCoordinatesProvider } from "../contexts/MouseCoordinatesContext/MouseCoordinatesContext";

const SpriteEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorSelectedProvider>
      <ToolSelectedProvider>
        <SelectionAreaProvider>
          <MouseCoordinatesProvider>
            <ZoomProvider>{children}</ZoomProvider>
          </MouseCoordinatesProvider>
        </SelectionAreaProvider>
      </ToolSelectedProvider>
    </ColorSelectedProvider>
  );
};

export default SpriteEditorProvider;
