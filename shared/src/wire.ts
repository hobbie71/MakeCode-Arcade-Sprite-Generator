import { z } from "zod";
import { AssetTypeSchema } from "./enums";
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
});
export type BaseGenerationSettings = z.infer<typeof BaseGenerationSettingsSchema>;

/** OpenAI-specific generation settings. Quality is no longer part of the wire
 *  contract — the server always generates at "low" (see openai.ts), so there is
 *  nothing OpenAI-specific to carry beyond the base settings today. Kept as a
 *  distinct named schema so the client/server keep their existing imports and a
 *  future OpenAI-only field has a home. */
export const OpenAIGenerationSettingsSchema = BaseGenerationSettingsSchema;
export type OpenAIGenerationSettings = z.infer<typeof OpenAIGenerationSettingsSchema>;

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

/** Response body for the image-generation endpoint. The client consumes
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
