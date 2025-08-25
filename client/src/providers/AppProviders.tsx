import { SpriteProvider } from "@/context/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "@/context/CanvasSizeContext/CanvasSizeContext";
import { PaletteSelectedProvider } from "@/context/PaletteSelectedContext/PaletteSelectedContext";
import { CanvasProvider } from "@/context/CanvasContext/CanvasContext";
import { ImageImportProvider } from "@/context/ImageImportContext/ImageImportContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SpriteProvider>
      <PaletteSelectedProvider>
        <CanvasProvider>
          <CanvasSizeProvider>
            <ImageImportProvider>{children}</ImageImportProvider>
          </CanvasSizeProvider>
        </CanvasProvider>
      </PaletteSelectedProvider>
    </SpriteProvider>
  );
};

export default AppProviders;
