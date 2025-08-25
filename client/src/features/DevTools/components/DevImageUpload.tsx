import React, { useRef, useState } from "react";
import { removeBackgroundAndCrop } from "@/features/InputSection/libs/backgroundDetection";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";
import { useColorToMakeCodeConverter } from "@/features/InputSection/hooks/useColorToMakeCodeConverter";
import { drawPixelOnCanvas } from "@/features/SpriteEditor/libs/drawPixelOnCanvas";
import { PIXEL_SIZE } from "@/features/SpriteEditor/constants/pixelSize";
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

interface Props {
  setCanvasArray: (canvasArray: HTMLCanvasElement[]) => void;
}

const DevImageUpload = ({ setCanvasArray }: Props) => {
  // States
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { height, width } = useCanvasSize();
  const { convertImage } = useColorToMakeCodeConverter();
  const { palette } = usePaletteSelected();

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvases: HTMLCanvasElement[] = [];

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
        canvases.push(tempCanvas);

        // Step 1.5: Remove background and crop to content bounds
        const croppedCanvas = removeBackgroundAndCrop(tempCanvas, 30);
        canvases.push(croppedCanvas);

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
        canvases.push(smallCanvas);

        // Step 3: Extract pixel data from target size canvas
        const imageData = smallCtx.getImageData(
          0,
          0,
          targetWidth,
          targetHeight
        );

        // Step 4: Turn image to Makecode colors

        const spriteData = convertImage(imageData, width, height);

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = width * PIXEL_SIZE;
        finalCanvas.height = height * PIXEL_SIZE;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            drawPixelOnCanvas(finalCanvas, { x, y }, spriteData[y][x], palette);
          }
        }

        canvases.push(finalCanvas);

        setCanvasArray(canvases);
      };
    };
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed p-4 rounded transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center ${
        isDragging
          ? "border-blue-400 bg-blue-800"
          : "border-white bg-transparent"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="Upload image">
      <svg
        className="w-10 h-10 mb-23 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
      <p className="paragraph text-center mb-2 text-white">
        Drag and drop an image here, or{" "}
        <span className="underline text-blue-500">browse</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        tabIndex={-1}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default DevImageUpload;
