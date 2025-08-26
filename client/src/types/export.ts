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

export const assetTypes: AssetType[] = [
  AssetType.Sprite,
  AssetType.Background,
  AssetType.Tile,
  AssetType.Tilemap,
  AssetType.Animation,
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

export const DEFAULT_TEXT_TO_SPRITE_SETTINGS: ImageExportSettings = {
  removeBackground: false,
  cropEdges: false,
  tolerance: 30,
};

export enum GenerationView {
  Side = "side",
  HighTopDown = "high top-down",
  LowTopDown = "low top-down",
}

export enum GenerationDirection {
  North = "north",
  NorthEast = "north-east",
  East = "east",
  SouthEast = "south-east",
  South = "south",
  SouthWest = "south-west",
  West = "west",
  NorthWest = "north-west",
}

export enum GenerationOutline {
  Lineless = "lineless",
  SelectiveOutline = "selective outline",
  BlackOutline = "single color black outline",
  ColorOutline = "single color outline",
}

export type TextExportSettings = {
  removeBackground: boolean;
  cropEdges: boolean;
  addBackground: boolean;
  fitFullCanvasSize: boolean;
  view: GenerationView;
  direction: GenerationDirection;
  outline: GenerationOutline;
};
