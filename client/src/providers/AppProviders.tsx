import { SpriteProvider } from "@/context/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "@/context/CanvasSizeContext/CanvasSizeContext";
import { PaletteSelectedProvider } from "@/context/PaletteSelectedContext/PaletteSelectedContext";
import { CanvasProvider } from "@/context/CanvasContext/CanvasContext";
import { ImageImportProvider } from "@/context/ImageImportContext/ImageImportContext";
import { AssetTypeProvider } from "@/context/AssetTypeContext/AssetTypeContext";
import { GenerationMethodProvider } from "@/context/GenerationMethodContext/GenerationMethodContext";
import { ImageSettingsProvider } from "@/context/ImageSettingsContext/ImageSettingsContext";
import { TextSettingsProvider } from "@/context/TextSettingsContext/TextSettingsContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AssetTypeProvider>
      <GenerationMethodProvider>
        <ImageSettingsProvider>
          <TextSettingsProvider>
            <SpriteProvider>
              <PaletteSelectedProvider>
                <CanvasProvider>
                  <CanvasSizeProvider>
                    <ImageImportProvider>{children}</ImageImportProvider>
                  </CanvasSizeProvider>
                </CanvasProvider>
              </PaletteSelectedProvider>
            </SpriteProvider>
          </TextSettingsProvider>
        </ImageSettingsProvider>
      </GenerationMethodProvider>
    </AssetTypeProvider>
  );
};

export default AppProviders;
