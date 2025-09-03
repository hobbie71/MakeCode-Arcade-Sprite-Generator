import { type RGBA } from "../../../utils/colors/colorConversion";
import {
  getImageDataFromCanvas,
  getPixel,
} from "../../../utils/getDataFromCanvas";

interface BackgroundDetectionResult {
  backgroundColor: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
 * Detects the background color and finds the bounding box of non-background content
 */
export const detectBackgroundAndBounds = (
  canvas: HTMLCanvasElement,
  tolerance: number = 30
): BackgroundDetectionResult => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width, height } = canvas;
  const imageData = getImageDataFromCanvas(canvas);
  const data = imageData.data;

  // Sample border pixels to determine background color (more data than just corners)
  const borderSamples = sampleBorderColors(data, width, height);

  // Find the most common border color (assuming it's the background)
  const backgroundColor = findMostCommonColor(borderSamples);

  // Find bounding box of non-background pixels
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = getPixel(data, width, x, y);

      // Check if pixel is significantly different from background
      if (!isColorSimilar(pixel, backgroundColor, tolerance)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If no content found, return full canvas
  if (maxX === -1) {
    return {
      backgroundColor: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`,
      boundingBox: { x: 0, y: 0, width, height },
    };
  }

  return {
    backgroundColor: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`,
    boundingBox: {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    },
  };
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
 * Removes background from canvas using flood fill algorithm
 */
export const removeBackground = (
  sourceCanvas: HTMLCanvasElement,
  tolerance: number = 30
): HTMLCanvasElement => {
  const detection = detectBackgroundAndBounds(sourceCanvas, tolerance);
  const { backgroundColor } = detection;

  // Create new canvas with same dimensions
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = sourceCanvas.width;
  processedCanvas.height = sourceCanvas.height;
  const processedCtx = processedCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!processedCtx) {
    throw new Error("Could not get processed canvas context");
  }

  // Get source image data
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) {
    throw new Error("Could not get source canvas context");
  }

  const sourceImageData = getImageDataFromCanvas(sourceCanvas);
  const sourceData = sourceImageData.data;

  // Create new image data for the processed canvas
  const processedImageData = processedCtx.createImageData(
    sourceCanvas.width,
    sourceCanvas.height
  );
  const processedData = processedImageData.data;

  // Copy all source data first
  for (let i = 0; i < sourceData.length; i++) {
    processedData[i] = sourceData[i];
  }

  // Parse background color from string
  const bgMatch = backgroundColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)/
  );

  if (!bgMatch) {
    processedCtx.putImageData(processedImageData, 0, 0);
    return processedCanvas;
  }

  const bgColor: RGBA = {
    r: parseInt(bgMatch[1]),
    g: parseInt(bgMatch[2]),
    b: parseInt(bgMatch[3]),
    a: bgMatch[4] ? parseInt(bgMatch[4]) : 255,
  };

  // Create visited array to track flood filled pixels
  const visited: boolean[][] = Array.from({ length: sourceCanvas.height }, () =>
    Array(sourceCanvas.width).fill(false)
  );

  const { width, height } = sourceCanvas;

  // Flood fill from border pixels that match background color
  // Top and bottom edges
  for (let x = 0; x < width; x++) {
    // Top edge
    const topPixel = getPixel(sourceData, width, x, 0);
    if (isColorSimilar(topPixel, bgColor, tolerance) && !visited[0][x]) {
      floodFill(sourceData, width, height, x, 0, bgColor, tolerance, visited);
    }

    // Bottom edge
    const bottomPixel = getPixel(sourceData, width, x, height - 1);
    if (
      isColorSimilar(bottomPixel, bgColor, tolerance) &&
      !visited[height - 1][x]
    ) {
      floodFill(
        sourceData,
        width,
        height,
        x,
        height - 1,
        bgColor,
        tolerance,
        visited
      );
    }
  }

  // Left and right edges (excluding corners to avoid duplication)
  for (let y = 1; y < height - 1; y++) {
    // Left edge
    const leftPixel = getPixel(sourceData, width, 0, y);
    if (isColorSimilar(leftPixel, bgColor, tolerance) && !visited[y][0]) {
      floodFill(sourceData, width, height, 0, y, bgColor, tolerance, visited);
    }

    // Right edge
    const rightPixel = getPixel(sourceData, width, width - 1, y);
    if (
      isColorSimilar(rightPixel, bgColor, tolerance) &&
      !visited[y][width - 1]
    ) {
      floodFill(
        sourceData,
        width,
        height,
        width - 1,
        y,
        bgColor,
        tolerance,
        visited
      );
    }
  }

  // Apply transparency to all visited (background) pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (visited[y][x]) {
        const i = (y * width + x) * 4;
        processedData[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
  }

  processedCtx.putImageData(processedImageData, 0, 0);
  return processedCanvas;
};

/**
 * Crops canvas to visible content bounds (non-transparent pixels only)
 * Crops until content touches at least 2 opposite edges
 */
export const cropToVisibleContent = (
  sourceCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width, height } = sourceCanvas;
  const imageData = getImageDataFromCanvas(sourceCanvas);
  const data = imageData.data;

  // Find bounding box of non-transparent pixels
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = getPixel(data, width, x, y);

      // Check if pixel is not fully transparent
      if (pixel.a > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If no visible content found, return original canvas
  if (maxX === -1) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = sourceCanvas.width;
    newCanvas.height = sourceCanvas.height;
    const newCtx = newCanvas.getContext("2d");
    if (newCtx) {
      newCtx.drawImage(sourceCanvas, 0, 0);
    }
    return newCanvas;
  }

  // Calculate padding on each side
  const leftPadding = minX;
  const rightPadding = width - maxX - 1;
  const topPadding = minY;
  const bottomPadding = height - maxY - 1;

  // Build two candidate crops:
  // 1) Horizontal touch: remove all left+right padding so content touches both left and right
  const horizSrcX = leftPadding;
  const horizSrcY = 0;
  const horizSrcW = Math.max(1, width - leftPadding - rightPadding); // = content width
  const horizSrcH = height; // keep full height
  const horizArea = horizSrcW * horizSrcH;

  // 2) Vertical touch: remove all top+bottom padding so content touches both top and bottom
  const vertSrcX = 0;
  const vertSrcY = topPadding;
  const vertSrcW = width; // keep full width
  const vertSrcH = Math.max(1, height - topPadding - bottomPadding); // = content height
  const vertArea = vertSrcW * vertSrcH;

  // Choose the option that preserves the larger area (minimal cropping)
  const useHorizontal = horizArea >= vertArea;

  const srcX = useHorizontal ? horizSrcX : vertSrcX;
  const srcY = useHorizontal ? horizSrcY : vertSrcY;
  const srcW = useHorizontal ? horizSrcW : vertSrcW;
  const srcH = useHorizontal ? horizSrcH : vertSrcH;

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
  const imageData = getImageDataFromCanvas(sourceCanvas);
  const data = imageData.data;

  let minX = sourceWidth;
  let minY = sourceHeight;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < sourceHeight; y++) {
    for (let x = 0; x < sourceWidth; x++) {
      const pixel = getPixel(data, sourceWidth, x, y);
      if (pixel.a > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If no content found, return canvas with target aspect ratio
  if (maxX === -1) {
    const filledCanvas = document.createElement("canvas");
    filledCanvas.width = targetWidth;
    filledCanvas.height = targetHeight;
    return filledCanvas;
  }

  // Calculate content dimensions and center
  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const contentCenterX = minX + contentWidth / 2;
  const contentCenterY = minY + contentHeight / 2;

  // Calculate target aspect ratio
  const targetAspect = targetWidth / targetHeight;

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
  const finalCropWidth = Math.max(
    1,
    Math.min(Math.floor(cropWidth), sourceWidth - Math.floor(cropX))
  );
  const finalCropHeight = Math.max(
    1,
    Math.min(Math.floor(cropHeight), sourceHeight - Math.floor(cropY))
  );
  const finalCropX = Math.floor(cropX);
  const finalCropY = Math.floor(cropY);

  // Create new canvas with target dimensions
  const filledCanvas = document.createElement("canvas");
  filledCanvas.width = targetWidth;
  filledCanvas.height = targetHeight;
  const filledCtx = filledCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!filledCtx) {
    throw new Error("Could not get filled canvas context");
  }

  // Draw the cropped content to fill the entire target canvas
  filledCtx.drawImage(
    sourceCanvas,
    finalCropX, // source x (crop start)
    finalCropY, // source y (crop start)
    finalCropWidth, // source width (cropped)
    finalCropHeight, // source height (cropped)
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
