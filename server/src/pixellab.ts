import type {
  GenerateImageResponse,
  MakeCodePalette,
  PixelLabGenerationSettings,
  Size,
} from "@makespritecode/shared";
import { config } from "./config";
import { getSpriteGenerationPrompt } from "./prompt";
import { getPixelLabFinalSize } from "./size";

const PIXELLAB_BASE = "https://api.pixellab.ai/v1";

// Ported from PixelLabServices.generate_sprite. The Python service used the
// `pixellab` SDK, which POSTs to /generate-image-pixflux with Bearer auth; we
// call it directly with fetch. image_size is sent as STRINGS to match the
// previous production behavior. The Pillow re-encode is dropped — we forward the
// returned base64 directly and report the requested final size as the dimensions.
export async function generatePixelLabSprite(
  settings: PixelLabGenerationSettings,
  intendedSize: Size,
  palette: MakeCodePalette,
): Promise<GenerateImageResponse> {
  const finalSize = getPixelLabFinalSize(intendedSize, settings.fitFullCanvasSize);

  const requestData: Record<string, unknown> = {
    description: getSpriteGenerationPrompt(settings, intendedSize, palette, false),
    image_size: {
      width: String(finalSize.width),
      height: String(finalSize.height),
    },
    no_background: !settings.addBackground,
  };
  // Optional params only when non-blank (parity with Python), same order.
  if (settings.quality && settings.quality.trim()) requestData.detail = settings.quality;
  if (settings.view && settings.view.trim()) requestData.view = settings.view;
  if (settings.outline && settings.outline.trim()) requestData.outline = settings.outline;
  if (settings.direction && settings.direction.trim()) requestData.direction = settings.direction;

  const res = await fetch(`${PIXELLAB_BASE}/generate-image-pixflux`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.PIXELLAB_API_KEY}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`PixelLab API error: ${res.status} ${res.statusText} ${detail}`);
  }

  const body = (await res.json()) as { image?: { base64?: string; format?: string } };
  const b64 = body.image?.base64;
  if (!b64) throw new Error("PixelLab returned no image data");
  const format = body.image?.format ?? "png";

  return {
    image_data: `data:image/${format};base64,${b64}`,
    width: finalSize.width,
    height: finalSize.height,
  };
}
