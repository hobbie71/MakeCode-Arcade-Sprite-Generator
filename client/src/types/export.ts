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
// ASSET TYPES
// =============================================================================

/** Types of assets that can be generated in MakeCode Arcade */
export enum AssetType {
  Sprite = "Sprite",
  Background = "Background",
  Tile = "Tile",
  Tilemap = "Tilemap",
  Animation = "Animation",
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
  PixelLab = "pixellab",
  GPTImage1 = "gpt-image-1",
}

/** AI model options with display names */
export const ALL_AI_MODELS = [
  { name: "PixelLab", model: AiModel.PixelLab },
  { name: "GPTImage1", model: AiModel.GPTImage1 },
];

// =============================================================================
// PIXELLAB SPECIFIC TYPES
// =============================================================================

/** Quality settings for PixelLab generation */
export enum PixelLabQuality {
  Auto = "",
  Low = "low detail",
  Medium = "medium detailed",
  High = "highly detailed",
}

/** PixelLab quality options with display names */
export const ALL_PIXELLAB_QUALITYS = [
  { name: "Auto", quality: PixelLabQuality.Auto },
  { name: "Low", quality: PixelLabQuality.Low },
  { name: "Medium", quality: PixelLabQuality.Medium },
  { name: "High", quality: PixelLabQuality.High },
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

/** Viewing perspectives for sprite generation */
export enum GenerationView {
  Auto = "",
  Side = "side",
  HighTopDown = "high top-down",
  LowTopDown = "low top-down",
}

/** Generation view options with display names */
export const ALL_GENERATION_VIEWS = [
  { name: "Auto", view: GenerationView.Auto },
  { name: "Side", view: GenerationView.Side },
  { name: "High Top Down", view: GenerationView.HighTopDown },
  { name: "Low Top Down", view: GenerationView.LowTopDown },
];

/** Cardinal and intercardinal directions for sprite generation */
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

/** Generation direction options with display names */
export const ALL_GENERATION_DIRECTIONS = [
  { name: "Auto", direction: GenerationDirection.Auto },
  { name: "North", direction: GenerationDirection.North },
  { name: "North-East", direction: GenerationDirection.NorthEast },
  { name: "East", direction: GenerationDirection.East },
  { name: "South-East", direction: GenerationDirection.SouthEast },
  { name: "South", direction: GenerationDirection.South },
  { name: "South-West", direction: GenerationDirection.SouthWest },
  { name: "West", direction: GenerationDirection.West },
  { name: "North-West", direction: GenerationDirection.NorthWest },
];

/** Outline styles for sprite generation */
export enum GenerationOutline {
  Auto = "",
  Lineless = "lineless",
  SelectiveOutline = "selective outline",
  BlackOutline = "single color black outline",
  ColorOutline = "single color outline",
}

/** Generation outline options with display names */
export const ALL_GENERATION_OUTLINES = [
  { name: "Auto", outline: GenerationOutline.Auto },
  { name: "Lineless", outline: GenerationOutline.Lineless },
  { name: "Selective Outline", outline: GenerationOutline.SelectiveOutline },
  { name: "Black Outline", outline: GenerationOutline.BlackOutline },
  { name: "Color Outline", outline: GenerationOutline.ColorOutline },
];

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

/** PixelLab specific generation settings */
export type PixelLabGenerationSettings = BaseGenerationSettings & {
  addBackground: boolean;
  fitFullCanvasSize: boolean;
  quality: PixelLabQuality;
  view: GenerationView;
  direction: GenerationDirection;
  outline: GenerationOutline;
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

/** Request payload for PixelLab sprite generation */
export type PixelLabSpriteRequest = {
  settings: PixelLabGenerationSettings;
  size: Size;
  palette: MakeCodePalette;
};

/** Request payload for OpenAI sprite generation */
export type OpenAISpriteRequest = {
  settings: OpenAIGenerationSettings;
  size: Size;
  palette: MakeCodePalette;
};

/** Legacy text export settings (for backwards compatibility) */
export type TextExportSettings = {
  AiModel: string;
  quality: string;
  prompt: string;
  removeBackground: boolean;
  cropEdges: boolean;
  tolerance: number;
  assetType: AssetType;
  style: Style;
  addBackground: boolean;
  fitFullCanvasSize: boolean;
  view: GenerationView;
  direction: GenerationDirection;
  outline: GenerationOutline;
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
