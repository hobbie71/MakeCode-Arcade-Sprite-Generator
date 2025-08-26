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

  // Sample corner pixels to determine background color
  const cornerSamples = [
    { x: 0, y: 0 }, // top-left
    { x: width - 1, y: 0 }, // top-right
    { x: 0, y: height - 1 }, // bottom-left
    { x: width - 1, y: height - 1 }, // bottom-right
  ];

  // Get color values for corner samples
  const cornerColors = cornerSamples.map(({ x, y }) => {
    const index = (y * width + x) * 4;
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3],
    };
  });

  // Find the most common corner color (assuming it's the background)
  const backgroundColor = findMostCommonColor(cornerColors);

  // Find bounding box of non-background pixels
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const pixel = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3],
      };

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
 * Removes background from canvas, making background pixels transparent
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

  // Ensure proper alpha handling and clear canvas to transparent
  processedCtx.globalCompositeOperation = "source-over";
  processedCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);

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

  // Parse background color
  const bgMatch = backgroundColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/
  );

  if (bgMatch) {
    const bgColor = {
      r: parseInt(bgMatch[1]),
      g: parseInt(bgMatch[2]),
      b: parseInt(bgMatch[3]),
      a: bgMatch[4] ? Math.round(parseFloat(bgMatch[4])) : 255,
    };

    // Process each pixel
    for (let i = 0; i < sourceData.length; i += 4) {
      const pixel = {
        r: sourceData[i],
        g: sourceData[i + 1],
        b: sourceData[i + 2],
        a: sourceData[i + 3],
      };

      if (isColorSimilar(pixel, bgColor, tolerance)) {
        // Make background pixels transparent
        processedData[i] = 0;
        processedData[i + 1] = 0;
        processedData[i + 2] = 0;
        processedData[i + 3] = 0;
      } else {
        // Keep non-background pixels
        processedData[i] = sourceData[i];
        processedData[i + 1] = sourceData[i + 1];
        processedData[i + 2] = sourceData[i + 2];
        processedData[i + 3] = sourceData[i + 3];
      }
    }

    processedCtx.putImageData(processedImageData, 0, 0);
  } else {
    // Fallback: copy original image
    processedCtx.drawImage(sourceCanvas, 0, 0);
  }

  return processedCanvas;
};

/**
 * Crops canvas to content bounds based on background detection
 */
export const cropToContent = (
  sourceCanvas: HTMLCanvasElement,
  tolerance: number = 30
): HTMLCanvasElement => {
  const detection = detectBackgroundAndBounds(sourceCanvas, tolerance);
  const { boundingBox } = detection;

  // Create new canvas with cropped dimensions
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = boundingBox.width;
  croppedCanvas.height = boundingBox.height;
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
    boundingBox.x,
    boundingBox.y,
    boundingBox.width,
    boundingBox.height,
    0,
    0,
    boundingBox.width,
    boundingBox.height
  );

  return croppedCanvas;
};

/**
 * Removes background and crops to content bounds (convenience function)
 */
export const removeBackgroundAndCrop = (
  sourceCanvas: HTMLCanvasElement,
  tolerance: number = 30
): HTMLCanvasElement => {
  const backgroundRemoved = removeBackground(sourceCanvas, tolerance);
  return cropToContent(backgroundRemoved, tolerance);
};

/**
 * Helper function to find the most common color among samples
 */
const findMostCommonColor = (
  colors: Array<{ r: number; g: number; b: number; a: number }>
) => {
  const colorMap = new Map<
    string,
    { color: { r: number; g: number; b: number; a: number }; count: number }
  >();

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
  color1: { r: number; g: number; b: number; a: number },
  color2: { r: number; g: number; b: number; a: number },
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
