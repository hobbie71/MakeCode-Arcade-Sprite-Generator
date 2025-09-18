import { ColorSelectedProvider } from "../contexts/ColorSelectedContext/ColorSelectedContext";
import { ToolSelectedProvider } from "../contexts/ToolSelectedContext/ToolSelectedContext";
import { ZoomProvider } from "../contexts/ZoomContext/ZoomContext";
import { SelectionAreaProvider } from "../contexts/SelectionArea/SelectionAreaContext";
import { MouseCoordinatesProvider } from "../contexts/MouseCoordinatesContext/MouseCoordinatesContext";
import { StrokeSizeProvider } from "../contexts/StrokeSizeContext/StrokeSizeContext";

const SpriteEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorSelectedProvider>
      <ToolSelectedProvider>
        <SelectionAreaProvider>
          <MouseCoordinatesProvider>
            <StrokeSizeProvider>
              <ZoomProvider>{children}</ZoomProvider>
            </StrokeSizeProvider>
          </MouseCoordinatesProvider>
        </SelectionAreaProvider>
      </ToolSelectedProvider>
    </ColorSelectedProvider>
  );
};

export default SpriteEditorProvider;
