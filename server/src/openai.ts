import OpenAI from "openai";
import type {
  GenerateImageResponse,
  MakeCodePalette,
  OpenAIGenerationSettings,
  Size,
} from "@makespritecode/shared";
import { config } from "./config";
import { getGenerationPrompt } from "./prompt";
import { getOpenAIFinalSize, openAIFinalSizeToDims } from "./size";

// Lazily constructed so importing this module (e.g. in tests, or for request
// validation that never reaches the API) doesn't require a key or open a client.
let _client: OpenAI | null = null;
function client(): OpenAI {
  return (_client ??= new OpenAI({ apiKey: config.OPENAI_API_KEY }));
}

// Ported from OpenAIServices.generate_sprite. The Python code decoded the
// returned PNG with Pillow and re-encoded it (a no-op round-trip) only to read
// width/height — we drop Pillow and derive the dimensions from the requested
// final size (gpt-image returns exactly that size).
export async function generateOpenAISprite(
  settings: OpenAIGenerationSettings,
  intendedSize: Size,
  palette: MakeCodePalette,
): Promise<GenerateImageResponse> {
  const finalSize = getOpenAIFinalSize(intendedSize);

  const params: OpenAI.Images.ImageGenerateParams = {
    model: "gpt-image-2",
    prompt: getGenerationPrompt(settings, palette),
    n: 1,
    // The SDK's `size` union predates gpt-image-2's arbitrary resolutions; the
    // API accepts any valid "WxH" string, so we assert past the stale literal type.
    size: finalSize as OpenAI.Images.ImageGenerateParams["size"],
    // Quality is forced to "low" for every generation: it is more than good
    // enough for pixel-art sprites and significantly cheaper. Medium/High were
    // removed entirely (no longer offered in the UI or carried on the wire).
    quality: "low",
  };

  const response = await client().images.generate(params);
  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no image data");

  const dims = openAIFinalSizeToDims(finalSize);
  return {
    image_data: `data:image/png;base64,${b64}`,
    width: dims.width,
    height: dims.height,
  };
}

export async function moderatePrompt(prompt: string) {
  return client().moderations.create({
    model: "omni-moderation-latest",
    input: prompt,
  });
}
