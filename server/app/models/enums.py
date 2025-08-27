from enum import Enum
from pydantic import BaseModel
from typing import Optional

class OpenAIFinalSize(Enum):
    Square = "1024x1024"
    Landscape = "1792x1024"
    Portrait = "1024x1792"

class Size(BaseModel):
    width: int
    height: int

class MakeCodePalette(BaseModel):
    colors: list[str]

class Quality(Enum):
    LOW = "low"
    STANDARD = "standard"
    HIGH = "hd"

class OpenAIGenerationSettings(BaseModel):
    prompt: str
    asset_type: str
    style: str = "anime"
    quality: Optional[Quality] = Quality.LOW
