import { type RGBA } from "../../../utils/colors/colorConversion";
import {
  getImageDataFromCanvas,
  getPixel,
} from "../../../utils/getDataFromCanvas";

interface ContentBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Sample full border pixels instead of just corners for more accurate background detection
 */
function sampleBorderColors(
  data: Uint8ClampedArray,
  width: number,
  height: number
): RGBA[] {
  const samples: RGBA[] = [];

  // Sample top and bottom edges
  for (let x = 0; x < width; x++) {
    samples.push(getPixel(data, width, x, 0)); // top
    samples.push(getPixel(data, width, x, height - 1)); // bottom
  }

  // Sample left and right edges (excluding corners to avoid duplication)
  for (let y = 1; y < height - 1; y++) {
    samples.push(getPixel(data, width, 0, y)); // left
    samples.push(getPixel(data, width, width - 1, y)); // right
  }

  return samples;
}

/**
 * Finds the bounding box of all non-transparent pixels, or null when the
 * canvas has no visible content
 */
const findVisibleContentBounds = (
  data: Uint8ClampedArray,
  width: number,
  height: number
): ContentBounds | null => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getPixel(data, width, x, y).a > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX === -1) return null;
  return { minX, minY, maxX, maxY };
};

/**
 * Flood fill algorithm to mark pixels as background
 */
function floodFill(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  targetColor: RGBA,
  tolerance: number,
  visited: boolean[][]
): void {
  const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];

  while (stack.length > 0) {
    const { x, y } = stack.pop()!;

    // Check bounds and if already visited
    if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x]) {
      continue;
    }

    const pixel = getPixel(data, width, x, y);

    // Check if pixel matches target color within tolerance
    if (!isColorSimilar(pixel, targetColor, tolerance)) {
      continue;
    }

    // Mark as visited
    visited[y][x] = true;

    // Add neighboring pixels to stack
    stack.push(
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 }
    );
  }
}

/**
 * Flood fills inward from every border pixel that matches the background
 * color, returning the mask of pixels reached (the background region)
 */
const markBackgroundFromEdges = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  bgColor: RGBA,
  tolerance: number
): boolean[][] => {
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array(width).fill(false)
  );

  const seedFill = (x: number, y: number) => {
    if (visited[y][x]) return;
    if (isColorSimilar(getPixel(data, width, x, y), bgColor, tolerance)) {
      floodFill(data, width, height, x, y, bgColor, tolerance, visited);
    }
  };

  // Top and bottom edges
  for (let x = 0; x < width; x++) {
    seedFill(x, 0);
    seedFill(x, height - 1);
  }

  // Left and right edges (excluding corners to avoid duplication)
  for (let y = 1; y < height - 1; y++) {
    seedFill(0, y);
    seedFill(width - 1, y);
  }

  return visited;
};

/**
 * Removes background from canvas using flood fill algorithm
 */
export const removeBackground = (
  sourceCanvas: HTMLCanvasElement,
  tolerance: number = 30
): HTMLCanvasElement => {
  const { width, height } = sourceCanvas;

  // Create new canvas with same dimensions
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = width;
  processedCanvas.height = height;
  const processedCtx = processedCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!processedCtx) {
    throw new Error("Could not get processed canvas context");
  }

  const sourceData = getImageDataFromCanvas(sourceCanvas).data;

  // Start the processed canvas as a copy of the source
  const processedImageData = processedCtx.createImageData(width, height);
  const processedData = processedImageData.data;
  processedData.set(sourceData);

  // The most common border color is assumed to be the background
  const bgColor = findMostCommonColor(
    sampleBorderColors(sourceData, width, height)
  );

  const background = markBackgroundFromEdges(
    sourceData,
    width,
    height,
    bgColor,
    tolerance
  );

  // Make every background pixel transparent
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (background[y][x]) {
        processedData[(y * width + x) * 4 + 3] = 0;
      }
    }
  }

  processedCtx.putImageData(processedImageData, 0, 0);
  return processedCanvas;
};

/**
 * Crops canvas to visible content bounds (non-transparent pixels only)
 * Tight crop: for each side (top, right, bottom, left), move inward until a colored (non-transparent) pixel is found.
 */
export const cropToVisibleContent = (
  sourceCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width, height } = sourceCanvas;
  const data = getImageDataFromCanvas(sourceCanvas).data;
  const bounds = findVisibleContentBounds(data, width, height);

  // If no visible content found, return original canvas
  if (!bounds) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = width;
    newCanvas.height = height;
    const newCtx = newCanvas.getContext("2d");
    if (newCtx) {
      newCtx.drawImage(sourceCanvas, 0, 0);
    }
    return newCanvas;
  }

  // Tight bounding box crop on all sides
  const srcX = bounds.minX;
  const srcY = bounds.minY;
  const srcW = Math.max(1, bounds.maxX - bounds.minX + 1);
  const srcH = Math.max(1, bounds.maxY - bounds.minY + 1);

  // Create new canvas with cropped dimensions
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = srcW;
  croppedCanvas.height = srcH;
  const croppedCtx = croppedCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!croppedCtx) {
    throw new Error("Could not get cropped canvas context");
  }

  // Copy the cropped region from source to new canvas
  croppedCtx.drawImage(
    sourceCanvas,
    srcX, // source x
    srcY, // source y
    srcW, // source width
    srcH, // source height
    0, // dest x
    0, // dest y
    srcW, // dest width
    srcH // dest height
  );

  return croppedCanvas;
};

/**
 * Largest crop rect with the target aspect ratio, centered on the content
 * bounds and clamped to the source canvas
 */
const computeAspectCrop = (
  bounds: ContentBounds,
  sourceWidth: number,
  sourceHeight: number,
  targetAspect: number
): { x: number; y: number; width: number; height: number } => {
  // Calculate content dimensions and center
  const contentWidth = bounds.maxX - bounds.minX + 1;
  const contentHeight = bounds.maxY - bounds.minY + 1;
  const contentCenterX = bounds.minX + contentWidth / 2;
  const contentCenterY = bounds.minY + contentHeight / 2;

  // Calculate crop dimensions that will touch all 4 edges while maintaining target aspect ratio
  let cropWidth, cropHeight;

  if (contentWidth / contentHeight > targetAspect) {
    // Content is wider than target aspect, height determines crop size
    cropHeight = contentHeight;
    cropWidth = cropHeight * targetAspect;
  } else {
    // Content is taller than target aspect, width determines crop size
    cropWidth = contentWidth;
    cropHeight = cropWidth / targetAspect;
  }

  // Center the crop around content center
  const cropX = Math.max(
    0,
    Math.min(sourceWidth - cropWidth, contentCenterX - cropWidth / 2)
  );
  const cropY = Math.max(
    0,
    Math.min(sourceHeight - cropHeight, contentCenterY - cropHeight / 2)
  );

  // Ensure crop dimensions are valid integers
  const x = Math.floor(cropX);
  const y = Math.floor(cropY);
  return {
    x,
    y,
    width: Math.max(1, Math.min(Math.floor(cropWidth), sourceWidth - x)),
    height: Math.max(1, Math.min(Math.floor(cropHeight), sourceHeight - y)),
  };
};

/**
 * Crops canvas until content touches all 4 edges, maintaining target aspect ratio
 * Removes parts that don't fit to make content fill the entire canvas
 */
export const fillToEdges = (
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
  const { width: sourceWidth, height: sourceHeight } = sourceCanvas;

  // Validate input dimensions
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("Source canvas must have positive dimensions");
  }

  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error("Target dimensions must be positive");
  }

  // Find the actual content bounds first
  const data = getImageDataFromCanvas(sourceCanvas).data;
  const bounds = findVisibleContentBounds(data, sourceWidth, sourceHeight);

  // Create new canvas with target dimensions
  const filledCanvas = document.createElement("canvas");
  filledCanvas.width = targetWidth;
  filledCanvas.height = targetHeight;

  // If no content found, return empty canvas with target aspect ratio
  if (!bounds) {
    return filledCanvas;
  }

  const filledCtx = filledCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!filledCtx) {
    throw new Error("Could not get filled canvas context");
  }

  const crop = computeAspectCrop(
    bounds,
    sourceWidth,
    sourceHeight,
    targetWidth / targetHeight
  );

  // Draw the cropped content to fill the entire target canvas
  filledCtx.drawImage(
    sourceCanvas,
    crop.x, // source x (crop start)
    crop.y, // source y (crop start)
    crop.width, // source width (cropped)
    crop.height, // source height (cropped)
    0, // dest x
    0, // dest y
    targetWidth, // dest width (fill target)
    targetHeight // dest height (fill target)
  );

  return filledCanvas;
};

/**
 * Helper function to find the most common color among samples
 */
const findMostCommonColor = (colors: RGBA[]): RGBA => {
  const colorMap = new Map<string, { color: RGBA; count: number }>();

  colors.forEach((color) => {
    const key = `${color.r}-${color.g}-${color.b}-${color.a}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { color, count: 1 });
    }
  });

  let mostCommon = colors[0];
  let maxCount = 0;

  colorMap.forEach(({ color, count }) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = color;
    }
  });

  return mostCommon;
};

/**
 * Helper function to check if two colors are similar within tolerance
 */
const isColorSimilar = (
  color1: RGBA,
  color2: RGBA,
  tolerance: number
): boolean => {
  const rDiff = Math.abs(color1.r - color2.r);
  const gDiff = Math.abs(color1.g - color2.g);
  const bDiff = Math.abs(color1.b - color2.b);
  const aDiff = Math.abs(color1.a - color2.a);

  return (
    rDiff <= tolerance &&
    gDiff <= tolerance &&
    bDiff <= tolerance &&
    aDiff <= tolerance
  );
};

export const scaleCanvasToTarget = (
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
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

  if (!ctx) throw new Error("Failed to get CTX");

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
