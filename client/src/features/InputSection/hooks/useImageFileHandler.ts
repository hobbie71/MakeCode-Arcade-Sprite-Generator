import { useCallback } from "react";

// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "@/context/ImageImportContext/useImageImports";

// Hook imports
import { usePasteData } from "@/features/SpriteEditor/hooks/usePasteData";
import { useColorToMakeCodeConverter } from "@/features/InputSection/hooks/useColorToMakeCodeConverter";

// Lib imports
import { removeBackgroundAndCrop } from "../libs/backgroundDetection";

export const useImageFileHandler = () => {
  const { width, height } = useCanvasSize();
  const { setImportCanvas, incrementVersion } = useImageImports();
  const { pasteSpriteData } = usePasteData();
  const { convertImage } = useColorToMakeCodeConverter();

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          // Step 1: Draw original image to a temp canvas
          const firstCanvas = document.createElement("canvas");
          firstCanvas.width = img.width;
          firstCanvas.height = img.height;
          const tempCtx = firstCanvas.getContext("2d", {
            willReadFrequently: true,
            alpha: true,
          });
          if (!tempCtx) return;

          tempCtx.globalCompositeOperation = "source-over";
          tempCtx.drawImage(img, 0, 0);

          setImportCanvas(firstCanvas);
          incrementVersion();

          // Step 1.5: Remove background and crop to content bounds
          const croppedCanvas = removeBackgroundAndCrop(firstCanvas, 30);

          // Step 2: Calculate dimensions to maintain aspect ratio within target bounds
          const targetWidth = width;
          const targetHeight = height;
          const sourceAspectRatio = croppedCanvas.width / croppedCanvas.height;
          const targetAspectRatio = targetWidth / targetHeight;

          let drawWidth, drawHeight;
          if (sourceAspectRatio > targetAspectRatio) {
            // Source is wider, fit to width
            drawWidth = targetWidth;
            drawHeight = Math.round(targetWidth / sourceAspectRatio);
          } else {
            // Source is taller, fit to height
            drawHeight = targetHeight;
            drawWidth = Math.round(targetHeight * sourceAspectRatio);
          }

          // Create canvas with target dimensions
          const smallCanvas = document.createElement("canvas");
          smallCanvas.width = targetWidth;
          smallCanvas.height = targetHeight;
          const smallCtx = smallCanvas.getContext("2d", {
            willReadFrequently: true,
            alpha: true,
          });
          if (!smallCtx) return;
          smallCtx.imageSmoothingEnabled = false;
          smallCtx.imageSmoothingQuality = "low";

          // Center the image within the target canvas
          const offsetX = Math.floor((targetWidth - drawWidth) / 2);
          const offsetY = Math.floor((targetHeight - drawHeight) / 2);

          smallCtx.drawImage(
            croppedCanvas,
            0,
            0,
            croppedCanvas.width,
            croppedCanvas.height,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight
          );

          // Step 3: Extract pixel data from target size canvas
          const imageData = smallCtx.getImageData(
            0,
            0,
            targetWidth,
            targetHeight
          );

          const spriteData = convertImage(imageData, width, height);

          pasteSpriteData(spriteData);
        };
      };
    },
    [
      width,
      height,
      setImportCanvas,
      incrementVersion,
      pasteSpriteData,
      convertImage,
    ]
  );

  return { handleFile };
};
