import { z } from "zod";

// Cross-wire enums: the string values ARE the wire values. Defined as TS enums
// (so the client keeps `AssetType.Sprite` member access in its UI catalogs) and
// wrapped with Zod for runtime request validation on the server.

/** Types of assets that can be generated in MakeCode Arcade. */
export enum AssetType {
  Sprite = "sprite",
  Background = "background",
  Tile = "tile",
  Tilemap = "tilemap",
  Animation = "animation",
}
export const AssetTypeSchema = z.enum(AssetType);

/** Art styles for sprite generation. */
export enum Style {
  Retro = "retro",
  Chibi = "chibi",
  Isometric = "isometric",
  Minimalist = "minimalist",
  Modern = "modern",
  Anime = "anime",
}
export const StyleSchema = z.enum(Style);

/** Quality settings for PixelLab generation. The "" (Auto) sentinel is load-bearing:
 *  the backend only forwards the field to PixelLab when it is non-blank. */
export enum PixelLabQuality {
  Auto = "",
  Low = "low detail",
  Medium = "medium detailed",
  High = "highly detailed",
}
export const PixelLabQualitySchema = z.enum(PixelLabQuality);

/** Quality settings for OpenAI generation. */
export enum OpenAIQuality {
  Low = "low",
  Medium = "medium",
}
export const OpenAIQualitySchema = z.enum(OpenAIQuality);

/** Viewing perspectives for sprite generation (PixelLab). "" = Auto (omitted). */
export enum GenerationView {
  Auto = "",
  Side = "side",
  HighTopDown = "high top-down",
  LowTopDown = "low top-down",
}
export const GenerationViewSchema = z.enum(GenerationView);

/** Cardinal/intercardinal directions for sprite generation (PixelLab). "" = Auto. */
export enum GenerationDirection {
  Auto = "",
  North = "north",
  NorthEast = "north-east",
  East = "east",
  SouthEast = "south-east",
  South = "south",
  SouthWest = "south-west",
  West = "west",
  NorthWest = "north-west",
}
export const GenerationDirectionSchema = z.enum(GenerationDirection);

/** Outline styles for sprite generation (PixelLab). "" = Auto. */
export enum GenerationOutline {
  Auto = "",
  Lineless = "lineless",
  SelectiveOutline = "selective outline",
  BlackOutline = "single color black outline",
  ColorOutline = "single color outline",
}
export const GenerationOutlineSchema = z.enum(GenerationOutline);
