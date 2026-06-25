// =============================================================================
// WIRE CONTRACT — single source of truth in @makespritecode/shared (ADR-0002)
// =============================================================================
// OpenAI-only. The cross-wire enums + request/response types live in the shared
// package and are re-exported here so existing `../types/export` imports across
// the client keep working unchanged.
import { AssetType } from "@makespritecode/shared";

export { AssetType };
export type {
  Size,
  OpenAIGenerationSettings,
  OpenAISpriteRequest,
  ModerationResponse,
} from "@makespritecode/shared";

// =============================================================================
// IMAGE EXPORT FORMATS (UI-only)
// =============================================================================

/** Supported image export formats for sprites */
export enum ImageExportFormats {
  PNG = "png",
  JPEG = "jpeg",
  WEBP = "webp",
}

// =============================================================================
// ASSET TYPES — UI selection catalog (AssetType enum from shared)
// =============================================================================

/** Available asset types for generation */
export const ALL_ASSETS_TYPE: AssetType[] = [
  AssetType.Sprite,
  AssetType.Background,
  AssetType.Tile,
];

// =============================================================================
// AI MODELS (UI-only; OpenAI-only)
// =============================================================================

/** UI-only model selector. The real OpenAI model id is set server-side, so this
 *  stays version-neutral and never needs bumping when the backend model changes. */
export enum AiModel {
  GPTImage = "gpt-image",
}

// =============================================================================
// GENERATION METHODS (UI-only)
// =============================================================================

/** Methods for generating sprites */
export enum GenerationMethod {
  ImageToSprite = "image",
  TextToSprite = "text",
  /** Start from an empty canvas at the chosen size (no AI, no upload). */
  BlankCanvas = "blank",
}

// =============================================================================
// POST-PROCESSING & EXPORT SETTINGS (UI-only)
// =============================================================================

/** Cropping options for post-processing */
export enum Crop {
  None = "",
  Edges = "edges",
  Fill = "fill",
}

/** Settings for post-processing generated images */
export type PostProcessingSettings = {
  removeBackground: boolean;
  crop: Crop;
  tolerance: number;
};
