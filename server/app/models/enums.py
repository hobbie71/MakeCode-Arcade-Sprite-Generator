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

# OPENAI SPECIFIC MODELS

class OpenAIQuality(Enum):
  Low = "low"
  Medium = "medium"

class OpenAIFinalSize(Enum):
  Square = "1024x1024"
  Landscape = "1536x1024"
  Portrait = "1024x1536"
