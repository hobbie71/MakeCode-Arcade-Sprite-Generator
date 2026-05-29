// =============================================================================
// WIRE CONTRACT — single source of truth in @makespritecode/shared (ADR-0002)
// =============================================================================
// The cross-wire enums (whose VALUES the UI catalogs below reference) and the
// request/response types live in the shared package. They are imported here for
// the catalogs and re-exported so existing `../types/export` imports across the
// client keep working unchanged.
import {
  AssetType,
  Style,
  PixelLabQuality,
  OpenAIQuality,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
} from "@makespritecode/shared";

export {
  AssetType,
  Style,
  PixelLabQuality,
  OpenAIQuality,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
};
export type {
  Size,
  BaseGenerationSettings,
  PixelLabGenerationSettings,
  OpenAIGenerationSettings,
  PixelLabSpriteRequest,
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
// AI MODELS (UI-only)
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
// PIXELLAB quality catalog (PixelLabQuality enum from shared)
// =============================================================================

/** PixelLab quality options with display names */
export const ALL_PIXELLAB_QUALITYS = [
  { name: "Auto", quality: PixelLabQuality.Auto },
  { name: "Low", quality: PixelLabQuality.Low },
  { name: "Medium", quality: PixelLabQuality.Medium },
  { name: "High", quality: PixelLabQuality.High },
];

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
}

/** Available generation methods */
export const generationMethods: GenerationMethod[] = [
  GenerationMethod.TextToSprite,
  GenerationMethod.ImageToSprite,
];

// =============================================================================
// GENERATION VIEW / DIRECTION / OUTLINE / STYLE catalogs (enums from shared)
// =============================================================================

/** Generation view options with display names */
export const ALL_GENERATION_VIEWS = [
  { name: "Auto", view: GenerationView.Auto },
  { name: "Side", view: GenerationView.Side },
  { name: "High Top Down", view: GenerationView.HighTopDown },
  { name: "Low Top Down", view: GenerationView.LowTopDown },
];

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

/** Generation outline options with display names */
export const ALL_GENERATION_OUTLINES = [
  { name: "Auto", outline: GenerationOutline.Auto },
  { name: "Lineless", outline: GenerationOutline.Lineless },
  { name: "Selective Outline", outline: GenerationOutline.SelectiveOutline },
  { name: "Black Outline", outline: GenerationOutline.BlackOutline },
  { name: "Color Outline", outline: GenerationOutline.ColorOutline },
];

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

// =============================================================================
// LEGACY TEXT EXPORT SETTINGS (UI-only; references shared enums as types)
// =============================================================================

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
