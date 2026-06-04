import { SpriteProvider } from "../context/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "../context/CanvasSizeContext/CanvasSizeContext";
import { PaletteSelectedProvider } from "../context/PaletteSelectedContext/PaletteSelectedContext";
import { CanvasProvider } from "../context/CanvasContext/CanvasContext";
import { ImageImportProvider } from "../context/ImageImportContext/ImageImportContext";
import { AssetTypeProvider } from "../context/AssetTypeContext/AssetTypeContext";
import { GenerationMethodProvider } from "../context/GenerationMethodContext/GenerationMethodContext";
import { AiModelProvider } from "../context/AiModelContext/AiModelContext";
import { LoadingProvider } from "../context/LoadingContext/LoadingContext";
import { OpenAISettingsProvider } from "../context/OpenAISettingsContext/OpenAISettingsContext";
import { PostProcessingProvider } from "../context/PostProcessingContext/PostProcessingContext";
import { ErrorProvider } from "../context/ErrorContext/ErrorContext";
import { PreviewCanvasProvider } from "../context/PreviewCanvasContext/PreviewCanvasContext";
import { TokenProvider } from "../context/TokenContext/TokenContext";
import { StrokeSizeProvider } from "../features/SpriteEditor/contexts/StrokeSizeContext/StrokeSizeContext";

/**
 * App-wide state that must survive hero → studio navigation (and back). All of
 * these are mounted once, above the router, so a sprite generated from the hero
 * widget is still there when we land in the studio.
 *
 * Editor-LOCAL contexts (Tool, Color, Zoom, Selection, MouseCoords, ShapeMode)
 * live inside SpriteEditorProvider, not here. StrokeSizeContext is the exception:
 * it stays global because useExportSpriteData reads it (ADR-0006 / plan).
 */
const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TokenProvider>
      <AssetTypeProvider>
        <GenerationMethodProvider>
          <SpriteProvider>
            <PaletteSelectedProvider>
              <CanvasProvider>
                <CanvasSizeProvider>
                  <LoadingProvider>
                    <AiModelProvider>
                      <OpenAISettingsProvider>
                        <ImageImportProvider>
                          <PostProcessingProvider>
                            <PreviewCanvasProvider>
                              <StrokeSizeProvider>
                                <ErrorProvider>{children}</ErrorProvider>
                              </StrokeSizeProvider>
                            </PreviewCanvasProvider>
                          </PostProcessingProvider>
                        </ImageImportProvider>
                      </OpenAISettingsProvider>
                    </AiModelProvider>
                  </LoadingProvider>
                </CanvasSizeProvider>
              </CanvasProvider>
            </PaletteSelectedProvider>
          </SpriteProvider>
        </GenerationMethodProvider>
      </AssetTypeProvider>
    </TokenProvider>
  );
};

export default GlobalProviders;
