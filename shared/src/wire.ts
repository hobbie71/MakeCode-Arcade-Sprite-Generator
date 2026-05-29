import { z } from "zod";
import {
  AssetTypeSchema,
  StyleSchema,
  PixelLabQualitySchema,
  OpenAIQualitySchema,
  GenerationViewSchema,
  GenerationDirectionSchema,
  GenerationOutlineSchema,
  PixelLabQuality,
  OpenAIQuality,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
} from "./enums";
import { MakeCodePaletteSchema } from "./palette";

/** Canvas size for sprite generation. */
export const SizeSchema = z.object({
  width: z.number().int(),
  height: z.number().int(),
});
export type Size = z.infer<typeof SizeSchema>;

/** Settings shared by all AI models. */
export const BaseGenerationSettingsSchema = z.object({
  prompt: z.string(),
  assetType: AssetTypeSchema,
  style: StyleSchema,
});
export type BaseGenerationSettings = z.infer<typeof BaseGenerationSettingsSchema>;

/** PixelLab-specific generation settings. The four enum fields default to Auto
 *  ("") so the backend can omit them from the upstream call, matching the
 *  previous Pydantic defaults. */
export const PixelLabGenerationSettingsSchema = BaseGenerationSettingsSchema.extend({
  addBackground: z.boolean(),
  fitFullCanvasSize: z.boolean(),
  quality: PixelLabQualitySchema.default(PixelLabQuality.Auto),
  view: GenerationViewSchema.default(GenerationView.Auto),
  direction: GenerationDirectionSchema.default(GenerationDirection.Auto),
  outline: GenerationOutlineSchema.default(GenerationOutline.Auto),
});
export type PixelLabGenerationSettings = z.infer<typeof PixelLabGenerationSettingsSchema>;

/** OpenAI-specific generation settings. */
export const OpenAIGenerationSettingsSchema = BaseGenerationSettingsSchema.extend({
  quality: OpenAIQualitySchema.default(OpenAIQuality.Medium),
});
export type OpenAIGenerationSettings = z.infer<typeof OpenAIGenerationSettingsSchema>;

/** Request body for POST /generate-image/pixellab. */
export const PixelLabSpriteRequestSchema = z.object({
  settings: PixelLabGenerationSettingsSchema,
  size: SizeSchema,
  palette: MakeCodePaletteSchema,
});
export type PixelLabSpriteRequest = z.infer<typeof PixelLabSpriteRequestSchema>;

/** Request body for POST /generate-image/openai. */
export const OpenAISpriteRequestSchema = z.object({
  settings: OpenAIGenerationSettingsSchema,
  size: SizeSchema,
  palette: MakeCodePaletteSchema,
});
export type OpenAISpriteRequest = z.infer<typeof OpenAISpriteRequestSchema>;

/** Request body for POST /moderation/moderate. */
export const ModerationRequestSchema = z.object({
  prompt: z.string(),
});
export type ModerationRequest = z.infer<typeof ModerationRequestSchema>;

/** Response body for both image-generation endpoints. The client consumes
 *  `image_data` (a `data:image/png;base64,...` URL); width/height are informational. */
export const GenerateImageResponseSchema = z.object({
  image_data: z.string(),
  width: z.number(),
  height: z.number(),
});
export type GenerateImageResponse = z.infer<typeof GenerateImageResponseSchema>;

/** Response body for POST /moderation/moderate. */
export const ModerationResponseSchema = z.object({
  is_appropriate: z.boolean(),
  flagged: z.boolean(),
  categories: z.record(z.string(), z.boolean()),
  category_scores: z.record(z.string(), z.number()),
});
export type ModerationResponse = z.infer<typeof ModerationResponseSchema>;
