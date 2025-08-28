import {
  GENERATE_OPENAI_IMAGE_API_URL,
  GENERATE_PIXELLAB_IMAGE_API_URL,
} from "@/constants/api";
import {
  PixelLabSpriteRequest,
  OpenAISpriteRequest,
  PixelLabGenerationSettings,
  OpenAIGenerationSettings,
  Size,
  MakeCodePalette,
} from "@/types/export";

export async function generatePixelLabImage(
  settings: PixelLabGenerationSettings,
  size: Size,
  palette: MakeCodePalette
) {
  const request: PixelLabSpriteRequest = {
    settings,
    size,
    palette,
  };

  const response = await fetch(GENERATE_PIXELLAB_IMAGE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`PixelLab API error: ${response.statusText}`);
  }

  return response.json();
}

export async function generateOpenAiImage(
  settings: OpenAIGenerationSettings,
  size: Size,
  palette: MakeCodePalette
) {
  const request: OpenAISpriteRequest = {
    settings,
    size,
    palette,
  };

  const response = await fetch(GENERATE_OPENAI_IMAGE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return response.json();
}
