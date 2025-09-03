import { type RGBA } from "../../../utils/colors/colorConversion";

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
 * Get a single pixel from image data
 */
function getPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
): RGBA {
  const i = (y * width + x) * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
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
  const imageData = ctx.getImageData(0, 0, width, height);
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

  const sourceImageData = sourceCtx.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height
  );
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
 * This function only looks at alpha values and doesn't make assumptions about background color
 */
export const cropToVisibleContent = (
  sourceCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width, height } = sourceCanvas;
  const imageData = ctx.getImageData(0, 0, width, height);
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

  // Create new canvas with cropped dimensions
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = maxX - minX + 1;
  croppedCanvas.height = maxY - minY + 1;
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
    minX,
    minY,
    croppedCanvas.width,
    croppedCanvas.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  return croppedCanvas;
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
