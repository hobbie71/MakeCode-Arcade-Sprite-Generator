// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { usePasteData } from "@/features/SpriteEditor/hooks/usePasteData";
import { useColorToMakeCodeConverter } from "@/features/InputSection/hooks/useColorToMakeCodeConverter";

// Lib imports
import { removeBackgroundAndCrop } from "../libs/backgroundDetection";

export const useImageImports = () => {
  const { width, height } = useCanvasSize();
  const { pasteSpriteData } = usePasteData();
  const { convertImage } = useColorToMakeCodeConverter();

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
        const tempCtx = tempCanvas.getContext("2d", {
          willReadFrequently: true,
          alpha: true,
        });
        if (tempCtx) {
          tempCtx.globalCompositeOperation = "source-over";
          tempCtx.drawImage(img, 0, 0);
        }

        // Step 1.5: Remove background and crop to content bounds
        const croppedCanvas = removeBackgroundAndCrop(tempCanvas, 30);

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
  };

  return { handleFile };
};
