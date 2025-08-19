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
