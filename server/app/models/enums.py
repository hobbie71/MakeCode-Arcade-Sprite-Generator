from enum import Enum
from typing import Dict
from pydantic import BaseModel, RootModel

# GENERAL MODELS

class AssetType(Enum):
  Sprite = "sprite"
  Background = "background"
  Tile = "tile"
  Tilemap = "tilemap"
  Animation = "animation"

class Style(Enum):
  Retro = "retro"
  Chibi = "chibi"
  Isometric = "isometric"
  Minimalist = "minimalist"
  Modern = "modern"
  Anime = "anime"

class GenerationView(Enum):
  Auto = ""
  Side = "side"
  HighTopDown = "high top-down"
  LowTopDown = "low top-down"

class GenerationDirection(Enum):
  Auto = ""
  North = "north"
  NorthEast = "north-east"
  East = "east"
  SouthEast = "south-east"
  South = "south"
  SouthWest = "south-west"
  West = "west"
  NorthWest = "north-west"

class GenerationOutline(Enum):
  Auto = ""
  Lineless = "lineless"
  SelectiveOutline = "selective outline"
  BlackOutline = "single color black outline"
  ColorOutline = "single color outline"

class Size(BaseModel):
  width: int
  height: int

class MakeCodePalette(RootModel[dict[str, str]]):
  root: dict[str, str]

# PIXEL LAB SPECIFIC MODELS

class PixelLabQuality(Enum):
  Auto = ""
  Low = "low detail"
  Medium = "medium detailed"
  High = "highly detailed"

# OPENAI SPECIFIC MODELS

class OpenAIQuality(Enum):
  Low = "low"
  Medium = "medium"

class OpenAIFinalSize(Enum):
  Square = "1024x1024"
  Landscape = "1536x1024"
  Portrait = "1024x1536"

# API MODELS

class BaseGenerationSettings(BaseModel):
  prompt: str
  assetType: AssetType
  style: Style

class PixelLabGenerationSettings(BaseGenerationSettings):
  addBackground: bool
  fitFullCanvasSize: bool
  quality: PixelLabQuality = PixelLabQuality.Auto
  view: GenerationView = GenerationView.Auto
  direction: GenerationDirection = GenerationDirection.Auto
  outline: GenerationOutline = GenerationOutline.Auto

class OpenAIGenerationSettings(BaseGenerationSettings):
  quality: OpenAIQuality = OpenAIQuality.Medium

class PixelLabSpriteGenerationRequest(BaseModel):
  settings: PixelLabGenerationSettings
  size: Size
  palette: MakeCodePalette

class OpenAISpriteGenerationRequest(BaseModel):
  settings: OpenAIGenerationSettings
  size: Size
  palette: MakeCodePalette
