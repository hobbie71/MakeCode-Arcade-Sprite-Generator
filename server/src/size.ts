import type { Size } from "@makespritecode/shared";

// Ported from get_final_size in app/services/openai_services.py.

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
