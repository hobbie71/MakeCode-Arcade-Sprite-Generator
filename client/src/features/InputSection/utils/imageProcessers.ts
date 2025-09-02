export const createCanvasFromImage = (
  img: HTMLImageElement
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!ctx) throw new Error("Failed to get CTX");

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(img, 0, 0);

  return canvas;
};

export const fileToImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to load image"));
    reader.readAsDataURL(file);
  });
};

export const scaleCanvasToTarget = (
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement | null => {
  // Calculate dimensions to maintain aspect ratio
  const sourceAspectRatio = sourceCanvas.width / sourceCanvas.height;
  const targetAspectRatio = targetWidth / targetHeight;

  let drawWidth: number, drawHeight: number;

  if (sourceAspectRatio > targetAspectRatio) {
    // Source is wider, fit to width
    drawWidth = targetWidth;
    drawHeight = Math.round(targetWidth / sourceAspectRatio);
  } else {
    // Source is taller, fit to height
    drawHeight = targetHeight;
    drawWidth = Math.round(targetHeight * sourceAspectRatio);
  }

  // Create target canvas
  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = targetWidth;
  targetCanvas.height = targetHeight;

  const ctx = targetCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!ctx) return null;

  // Configure for pixel art (no smoothing)
  ctx.imageSmoothingEnabled = false;

  // Center the image within the target canvas
  const offsetX = Math.floor((targetWidth - drawWidth) / 2);
  const offsetY = Math.floor((targetHeight - drawHeight) / 2);

  ctx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight
  );

  return targetCanvas;
};
