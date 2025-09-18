import { SpriteProvider } from "../context/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "../context/CanvasSizeContext/CanvasSizeContext";
import { PaletteSelectedProvider } from "../context/PaletteSelectedContext/PaletteSelectedContext";
import { CanvasProvider } from "../context/CanvasContext/CanvasContext";
import { ImageImportProvider } from "../context/ImageImportContext/ImageImportContext";
import { AssetTypeProvider } from "../context/AssetTypeContext/AssetTypeContext";
import { GenerationMethodProvider } from "../context/GenerationMethodContext/GenerationMethodContext";
import { AiModelProvider } from "../context/AiModelContext/AiModelContext";
import { LoadingProvider } from "../context/LoadingContext/LoadingContext";
import { PixelLabSettingsProvider } from "../context/PixelLabSettingsContext/PixelLabSettingsContext";
import { OpenAISettingsProvider } from "../context/OpenAISettingsContext/OpenAISettingsContext";
import { PostProcessingProvider } from "../context/PostProcessingContext/PostProcessingContext";
import { ErrorProvider } from "../context/ErrorContext/ErrorContext";
import { PreviewCanvasProvider } from "../context/PreviewCanvasContext/PreviewCanvasContext";
import { StrokeSizeProvider } from "../features/SpriteEditor/contexts/StrokeSizeContext/StrokeSizeContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AssetTypeProvider>
      <GenerationMethodProvider>
        <SpriteProvider>
          <PaletteSelectedProvider>
            <CanvasProvider>
              <CanvasSizeProvider>
                <LoadingProvider>
                  <AiModelProvider>
                    <PixelLabSettingsProvider>
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
                    </PixelLabSettingsProvider>
                  </AiModelProvider>
                </LoadingProvider>
              </CanvasSizeProvider>
            </CanvasProvider>
          </PaletteSelectedProvider>
        </SpriteProvider>
      </GenerationMethodProvider>
    </AssetTypeProvider>
  );
};

export default AppProviders;
