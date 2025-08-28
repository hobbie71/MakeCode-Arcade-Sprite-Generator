export enum ImageExportFormats {
  PNG = "png",
  JPEG = "jpeg",
  WEBP = "webp",
}

export enum AssetType {
  Sprite = "sprite",
  Background = "background",
  Tile = "tile",
  Tilemap = "tilemap",
  Animation = "animation",
}

export const ALL_ASSETS_TYPE: AssetType[] = [
  AssetType.Sprite,
  AssetType.Background,
  AssetType.Tile,
];

export enum AiModel {
  PixelLab = "pixellab",
  GPTImage1 = "gpt-image-1",
}

export const ALL_AI_MODELS = [
  { name: "PixelLab", model: AiModel.PixelLab },
  { name: "GPTImage1", model: AiModel.GPTImage1 },
];

// PixelLab specific types
export enum PixelLabQuality {
  Auto = "",
  Low = "low detail",
  Medium = "medium detailed",
  High = "highly detailed",
}

export const ALL_PIXELLAB_QUALITYS = [
  { name: "Auto", quality: PixelLabQuality.Auto },
  { name: "Low", quality: PixelLabQuality.Low },
  { name: "Medium", quality: PixelLabQuality.Medium },
  { name: "High", quality: PixelLabQuality.High },
];

// OpenAI specific types
export enum OpenAIQuality {
  Low = "low",
  Medium = "medium",
}

export const ALL_OPENAI_QUALITYS = [
  { name: "Low", quality: OpenAIQuality.Low },
  { name: "Medium", quality: OpenAIQuality.Medium },
];

export enum GenerationMethod {
  ImageToSprite = "image",
  TextToSprite = "text",
}

export const generationMethods: GenerationMethod[] = [
  GenerationMethod.TextToSprite,
  GenerationMethod.ImageToSprite,
];

export type ImageExportSettings = {
  removeBackground: boolean;
  cropEdges: boolean;
  tolerance: number;
};

export type PostProcessingSettings = {
  removeBackground: boolean;
  cropEdges: boolean;
  tolerance: number;
};

export const DEFAULT_TEXT_TO_SPRITE_SETTINGS: ImageExportSettings = {
  removeBackground: false,
  cropEdges: false,
  tolerance: 30,
};

export enum GenerationView {
  Auto = "",
  Side = "side",
  HighTopDown = "high top-down",
  LowTopDown = "low top-down",
}

export const ALL_GENERATION_VIEWS = [
  { name: "Auto", view: GenerationView.Auto },
  { name: "Side", view: GenerationView.Side },
  { name: "High Top Down", view: GenerationView.HighTopDown },
  { name: "Low Top Down", view: GenerationView.LowTopDown },
];

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

export enum GenerationOutline {
  Auto = "",
  Lineless = "lineless",
  SelectiveOutline = "selective outline",
  BlackOutline = "single color black outline",
  ColorOutline = "single color outline",
}

export const ALL_GENERATION_OUTLINES = [
  { name: "Auto", outline: GenerationOutline.Auto },
  { name: "Lineless", outline: GenerationOutline.Lineless },
  { name: "Selective Outline", outline: GenerationOutline.SelectiveOutline },
  { name: "Black Outline", outline: GenerationOutline.BlackOutline },
  { name: "Color Outline", outline: GenerationOutline.ColorOutline },
];

export enum Style {
  Retro = "retro",
  Chibi = "chibi",
  Isometric = "isometric",
  Minimalist = "minimalist",
  Modern = "modern",
  Anime = "anime",
}

export const ALL_STYLES = [
  { name: "Retro", style: Style.Retro },
  { name: "Chibi", style: Style.Chibi },
  { name: "Isometric", style: Style.Isometric },
  { name: "Minimalist", style: Style.Minimalist },
  { name: "Modern", style: Style.Modern },
  { name: "Anime", style: Style.Anime },
];

// Base generation settings
export type BaseGenerationSettings = {
  prompt: string;
  assetType: AssetType;
  style: Style;
};

// PixelLab specific generation settings
export type PixelLabGenerationSettings = BaseGenerationSettings & {
  addBackground: boolean;
  fitFullCanvasSize: boolean;
  quality: PixelLabQuality;
  view: GenerationView;
  direction: GenerationDirection;
  outline: GenerationOutline;
};

// OpenAI specific generation settings
export type OpenAIGenerationSettings = BaseGenerationSettings & {
  quality: OpenAIQuality;
};

// Size type to match backend
export type Size = {
  width: number;
  height: number;
};

// MakeCodePalette type to match backend
export type MakeCodePalette = Record<string, string>;

// Request types to match backend
export type PixelLabSpriteRequest = {
  settings: PixelLabGenerationSettings;
  size: Size;
  palette: MakeCodePalette;
};

export type OpenAISpriteRequest = {
  settings: OpenAIGenerationSettings;
  size: Size;
  palette: MakeCodePalette;
};

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
