import { ColorSelectedProvider } from "../contexts/ColorSelectedContext/ColorSelectedContext";
import { ToolSelectedProvider } from "../contexts/ToolSelectedContext/ToolSelectedContext";
import { ZoomProvider } from "../contexts/ZoomContext/ZoomContext";
import { SelectionAreaProvider } from "../contexts/SelectionArea/SelectionAreaContext";
import { MouseCoordinatesProvider } from "../contexts/MouseCoordinatesContext/MouseCoordinatesContext";
import { GridProvider } from "../contexts/GridContext/GridContext";
import { SourceGhostProvider } from "../contexts/SourceGhostContext/SourceGhostContext";
import { ShapeModeProvider } from "../contexts/ShapeModeContext/ShapeModeContext";
import { FillOptionsProvider } from "../contexts/FillOptionsContext/FillOptionsContext";
import { PixelPerfectProvider } from "../contexts/PixelPerfectContext/PixelPerfectContext";
// NOTE: HistoryProvider lives in GlobalProviders (not here) because usePasteData
// → useImageFileHandler → useHistory runs inside the Generate/Resize modals and
// the hero widget, which render OUTSIDE this editor-local provider tree.

const SpriteEditorProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ColorSelectedProvider>
      <ToolSelectedProvider>
        <SelectionAreaProvider>
          <MouseCoordinatesProvider>
            <ZoomProvider>
              <GridProvider>
                <SourceGhostProvider>
                  <ShapeModeProvider>
                    <FillOptionsProvider>
                      <PixelPerfectProvider>{children}</PixelPerfectProvider>
                    </FillOptionsProvider>
                  </ShapeModeProvider>
                </SourceGhostProvider>
              </GridProvider>
            </ZoomProvider>
          </MouseCoordinatesProvider>
        </SelectionAreaProvider>
      </ToolSelectedProvider>
    </ColorSelectedProvider>
  );
};

export default SpriteEditorProvider;
