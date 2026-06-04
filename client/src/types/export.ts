// =============================================================================
// WIRE CONTRACT — single source of truth in @makespritecode/shared (ADR-0002)
// =============================================================================
// OpenAI-only. The cross-wire enums + request/response types live in the shared
// package and are re-exported here so existing `../types/export` imports across
// the client keep working unchanged.
import { AssetType, Style, OpenAIQuality } from "@makespritecode/shared";

export { AssetType, Style, OpenAIQuality };
export type {
  Size,
  BaseGenerationSettings,
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

export const ALL_IMAGE_EXPORT_FORMATS = [
  { name: "PNG", format: ImageExportFormats.PNG },
  { name: "JPEG", format: ImageExportFormats.JPEG },
  { name: "WEBP", format: ImageExportFormats.WEBP },
];

// =============================================================================
// CODE EXPORT FORMATS (UI-only)
// =============================================================================

/** Supported code export formats for sprites */
export enum CodeExportFormats {
  SPRITE_EDITOR = "sprite-editor",
  JAVASCRIPT = "javascript",
  PYTHON = "python",
}

export const ALL_CODE_EXPORT_FORMATS = [
  { name: "Sprite Editor", format: CodeExportFormats.SPRITE_EDITOR },
  { name: "Javascript", format: CodeExportFormats.JAVASCRIPT },
  { name: "Python", format: CodeExportFormats.PYTHON },
];

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

/** Available AI models for sprite generation */
export enum AiModel {
  GPTImage1 = "gpt-image-1",
}

/** AI model options with display names */
export const ALL_AI_MODELS = [{ name: "GPTImage1-5", model: AiModel.GPTImage1 }];

// =============================================================================
// OPENAI quality catalog (OpenAIQuality enum from shared)
// =============================================================================

/** OpenAI quality options with display names */
export const ALL_OPENAI_QUALITYS = [
  { name: "Low", quality: OpenAIQuality.Low },
  { name: "Medium", quality: OpenAIQuality.Medium },
];

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

/** Available generation methods */
export const generationMethods: GenerationMethod[] = [
  GenerationMethod.TextToSprite,
  GenerationMethod.ImageToSprite,
];

// =============================================================================
// STYLE catalog (Style enum from shared)
// =============================================================================

/** Style options with display names */
export const ALL_STYLES = [
  { name: "Retro", style: Style.Retro },
  { name: "Chibi", style: Style.Chibi },
  { name: "Isometric", style: Style.Isometric },
  { name: "Minimalist", style: Style.Minimalist },
  { name: "Modern", style: Style.Modern },
  { name: "Anime", style: Style.Anime },
];

// =============================================================================
// POST-PROCESSING & EXPORT SETTINGS (UI-only)
// =============================================================================

/** Settings for image export processing */
export type ImageExportSettings = {
  removeBackground: boolean;
  cropEdges: boolean;
  tolerance: number;
};

/** Cropping options for post-processing */
export enum Crop {
  None = "",
  Edges = "edges",
  Fill = "fill",
}

/** Crop options with display names */
export const ALL_CROP_OPTIONS = [
  { name: "None", option: Crop.None },
  { name: "Edges", option: Crop.Edges },
  { name: "Fill", option: Crop.Fill },
];

/** Settings for post-processing generated images */
export type PostProcessingSettings = {
  removeBackground: boolean;
  crop: Crop;
  tolerance: number;
};

/** Default settings for text-to-sprite generation */
export const DEFAULT_TEXT_TO_SPRITE_SETTINGS: ImageExportSettings = {
  removeBackground: false,
  cropEdges: false,
  tolerance: 30,
};
