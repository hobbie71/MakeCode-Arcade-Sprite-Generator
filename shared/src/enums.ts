import { z } from "zod";

// Cross-wire enums: the string values ARE the wire values. Defined as TS enums
// (so the client keeps `AssetType.Sprite` member access in its UI catalogs) and
// wrapped with Zod for runtime request validation on the server. OpenAI-only.

/** Types of assets that can be generated in MakeCode Arcade. */
export enum AssetType {
  Sprite = "sprite",
  Background = "background",
  Tile = "tile",
  Tilemap = "tilemap",
  Animation = "animation",
}
export const AssetTypeSchema = z.enum(AssetType);

/** Quality settings for OpenAI generation. */
export enum OpenAIQuality {
  Low = "low",
  Medium = "medium",
}
export const OpenAIQualitySchema = z.enum(OpenAIQuality);
