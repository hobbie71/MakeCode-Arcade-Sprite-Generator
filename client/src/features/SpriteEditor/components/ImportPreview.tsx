import { useRef, useEffect } from "react";

// Context imports
import { useImageImports } from "@/context/ImageImportContext/useImageImports";

const ImportPreview = () => {
  const { importCanvas, importVersion } = useImageImports();
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!importCanvas) return;
    const previewCanvas = previewRef.current;
    if (!previewCanvas) return;

    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    // Resize preview canvas to match importCanvas
    previewCanvas.width = importCanvas.width;
    previewCanvas.height = importCanvas.height;
    ctx.clearRect(0, 0, importCanvas.width, importCanvas.height);
    ctx.drawImage(importCanvas, 0, 0);
  }, [importCanvas, importVersion]);

  if (!importCanvas) {
    return null;
  }

  return (
    <canvas
      ref={previewRef}
      className="absolute top-1 right-1 border-2 border-solid border-white max-w-32 max-h-32 "></canvas>
  );
};

export default ImportPreview;
