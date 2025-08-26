import { useRef, useEffect } from "react";

// Context imports
import { useImageImports } from "@/context/ImageImportContext/useImageImports";

// Lib imports
import { createCanvasFromImage } from "@/features/InputSection/libs/imageProcesser";

const ImportPreview = () => {
  const { importedImage } = useImageImports();
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!importedImage) return;
    const previewCanvas = previewRef.current;
    if (!previewCanvas) return;

    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    // Create an image element from the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const importCanvas = createCanvasFromImage(img);
        if (!importCanvas) return;

        // Resize preview canvas to match importCanvas
        previewCanvas.width = importCanvas.width;
        previewCanvas.height = importCanvas.height;
        ctx.clearRect(0, 0, importCanvas.width, importCanvas.height);
        ctx.drawImage(importCanvas, 0, 0);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(importedImage);
  }, [importedImage]);

  if (!importedImage) {
    return null;
  }

  return (
    <canvas
      ref={previewRef}
      className="absolute top-1 right-1 border-2 border-solid border-white max-w-32 max-h-32 "></canvas>
  );
};

export default ImportPreview;
