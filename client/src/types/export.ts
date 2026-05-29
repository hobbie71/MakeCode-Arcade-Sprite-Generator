import type { MakeCodePalette } from "./color";

// =============================================================================
// IMAGE EXPORT FORMATS
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
// CODE EXPORT FORMATS
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
// ASSET TYPES
// =============================================================================

/** Types of assets that can be generated in MakeCode Arcade */
export enum AssetType {
  Sprite = "sprite",
  Background = "background",
  Tile = "tile",
  Tilemap = "tilemap",
  Animation = "animation",
}

/** Available asset types for generation */
export const ALL_ASSETS_TYPE: AssetType[] = [
  AssetType.Sprite,
  AssetType.Background,
  AssetType.Tile,
];

// =============================================================================
// AI MODELS
// =============================================================================

/** Available AI models for sprite generation */
export enum AiModel {
  GPTImage1 = "gpt-image-1",
}

/** AI model options with display names */
export const ALL_AI_MODELS = [
  { name: "GPTImage1-5", model: AiModel.GPTImage1 },
];

// =============================================================================
// OPENAI SPECIFIC TYPES
// =============================================================================

/** Quality settings for OpenAI generation */
export enum OpenAIQuality {
  Low = "low",
  Medium = "medium",
}

/** OpenAI quality options with display names */
export const ALL_OPENAI_QUALITYS = [
  { name: "Low", quality: OpenAIQuality.Low },
  { name: "Medium", quality: OpenAIQuality.Medium },
];

// =============================================================================
// GENERATION METHODS
// =============================================================================

/** Methods for generating sprites */
export enum GenerationMethod {
  ImageToSprite = "image",
  TextToSprite = "text",
}

/** Available generation methods */
export const generationMethods: GenerationMethod[] = [
  GenerationMethod.TextToSprite,
  GenerationMethod.ImageToSprite,
];

// =============================================================================
// GENERATION SETTINGS & STYLES
// =============================================================================

/** Art styles for sprite generation */
export enum Style {
  Retro = "retro",
  Chibi = "chibi",
  Isometric = "isometric",
  Minimalist = "minimalist",
  Modern = "modern",
  Anime = "anime",
}

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
// POST-PROCESSING & EXPORT SETTINGS
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

// =============================================================================
// GENERATION SETTINGS TYPES
// =============================================================================

/** Base settings shared by all AI models */
export type BaseGenerationSettings = {
  prompt: string;
  assetType: AssetType;
  style: Style;
};

/** OpenAI specific generation settings */
export type OpenAIGenerationSettings = BaseGenerationSettings & {
  quality: OpenAIQuality;
};

// =============================================================================
// REQUEST TYPES
// =============================================================================

/** Canvas size for sprite generation */
export type Size = {
  width: number;
  height: number;
};

/** Request payload for OpenAI sprite generation */
export type OpenAISpriteRequest = {
  settings: OpenAIGenerationSettings;
  size: Size;
  palette: MakeCodePalette;
};

// =============================================================================
// MODERATION RESPONSE
// =============================================================================

/** Response from content moderation API */
export interface ModerationResponse {
  is_appropriate: boolean;
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
}
