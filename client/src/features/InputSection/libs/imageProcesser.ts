// Lib imports
import {
  cropToContent,
  removeBackground as removeBackgroundFromImage,
  removeBackgroundAndCrop,
} from "../libs/backgroundDetection";

// Type imports
import { ImageExportSettings } from "@/types/export";

export const createCanvasFromImage = (
  img: HTMLImageElement
): HTMLCanvasElement | null => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!ctx) return null;

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(img, 0, 0);

  return canvas;
};

export const processImageWithSettings = (
  canvas: HTMLCanvasElement,
  settings: ImageExportSettings
): HTMLCanvasElement => {
  const { cropEdges, removeBackground, tolerance } = settings;

  if (cropEdges && removeBackground) {
    return removeBackgroundAndCrop(canvas, tolerance);
  }

  if (cropEdges) {
    return cropToContent(canvas, tolerance);
  }

  if (removeBackground) {
    return removeBackgroundFromImage(canvas, tolerance);
  }

  return canvas;
};

export const resizeCanvasToTarget = (
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
