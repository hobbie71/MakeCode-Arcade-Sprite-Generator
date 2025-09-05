from enum import Enum

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
