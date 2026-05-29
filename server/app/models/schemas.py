from pydantic import BaseModel, RootModel
from app.models.enums import (
    AssetType,
    Style,
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

class OpenAIGenerationSettings(BaseGenerationSettings):
    quality: OpenAIQuality = OpenAIQuality.Medium

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