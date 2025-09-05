from pydantic import BaseModel, RootModel
from app.models.enums import (
    AssetType, 
    Style, 
    PixelLabQuality, 
    GenerationView, 
    GenerationDirection, 
    GenerationOutline,
    OpenAIQuality
)

class Size(BaseModel):
    width: int
    height: int

class MakeCodePalette(RootModel[dict[str, str]]):
    root: dict[str, str]

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

# Moderation schemas
class ModerationRequest(BaseModel):
    prompt: str

class ModerationResponse(BaseModel):
    is_appropriate: bool
    flagged: bool
    categories: dict
    category_scores: dict