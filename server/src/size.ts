import type { Size } from "@makespritecode/shared";

// Ported from get_final_size in app/services/{openai,pixellab}_services.py.

export type OpenAIFinalSize = "1024x1024" | "1536x1024" | "1024x1536";

/** OpenAI: pick square / landscape / portrait by aspect ratio. */
export function getOpenAIFinalSize(size: Size): OpenAIFinalSize {
  const aspectRatio = size.width / size.height;
  const squareThreshold = 1.2;
  if (aspectRatio >= squareThreshold) return "1536x1024"; // Landscape
  if (aspectRatio <= 1 / squareThreshold) return "1024x1536"; // Portrait
  return "1024x1024"; // Square
}

export function openAIFinalSizeToDims(size: OpenAIFinalSize): Size {
  const [w, h] = size.split("x");
  return { width: Number(w), height: Number(h) };
}

/** Python's round() uses banker's rounding (round half to even); JS Math.round
 *  rounds half up. Replicate for exact parity on the rare .5 pixel case. */
export function pythonRound(n: number): number {
  const floor = Math.floor(n);
  const diff = n - floor;
  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
}

/** PixelLab: scale up to a preferred size (>= 2x the largest dim, min 32),
 *  preserving aspect ratio, clamped to [32, 400]. */
export function getPixelLabFinalSize(size: Size, fitFullCanvasSize: boolean): Size {
  if (fitFullCanvasSize) return { width: size.width, height: size.height };

  const maxDimension = Math.max(size.width, size.height);
  const minTargetSize = Math.max(32, maxDimension * 2);
  const aspectRatio = size.width / size.height;
  const preferredSizes = [128, 320, 400];

  let targetSize: number | null = null;
  for (const pref of preferredSizes) {
    if (pref >= minTargetSize) {
      targetSize = pref;
      break;
    }
  }
  if (targetSize === null) targetSize = Math.min(minTargetSize, 400);

  let finalWidth: number;
  let finalHeight: number;
  if (aspectRatio >= 1) {
    finalWidth = targetSize;
    finalHeight = pythonRound(targetSize / aspectRatio);
  } else {
    finalHeight = targetSize;
    finalWidth = pythonRound(targetSize * aspectRatio);
  }

  finalWidth = Math.max(32, Math.min(400, finalWidth));
  finalHeight = Math.max(32, Math.min(400, finalHeight));
  return { width: finalWidth, height: finalHeight };
}
