// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

// Hook imports
import { usePasteData } from "@/features/SpriteEditor/hooks/usePasteData";

// Lib imports
import { convertImageDataToSpriteData } from "../libs/convertImageDataToSpriteData";

export const useImageImports = () => {
  const { width, height } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { pasteSpriteData } = usePasteData();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        // Step 1: Draw original image to a temp canvas
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx?.drawImage(img, 0, 0);

        // Step 2: Draw scaled-down image to 16x16 canvas with pixelation
        const targetSize = Math.min(width, height);
        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = targetSize;
        smallCanvas.height = targetSize;
        const smallCtx = smallCanvas.getContext("2d");
        if (!smallCtx) return;

        smallCtx.imageSmoothingEnabled = false;
        smallCtx.clearRect(0, 0, targetSize, targetSize);
        smallCtx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          0,
          0,
          targetSize,
          targetSize
        );
        // Step 3: Extract pixel data from 16x16 canvas
        const imageData = smallCtx.getImageData(0, 0, targetSize, targetSize);

        const spriteData = convertImageDataToSpriteData(
          imageData,
          width,
          palette
        );

        pasteSpriteData(spriteData);
      };
    };
  };

  return { handleFile };
};
