from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class SpriteBase(BaseModel):
    name: str
    width: int
    height: int
    data: List[List[str]]  # 2D array of color codes
    colors: List[str]      # List of used color codes

class SpriteCreate(SpriteBase):
    pass

class SpriteUpdate(BaseModel):
    name: Optional[str] = None
    data: Optional[List[List[str]]] = None
    colors: Optional[List[str]] = None

class SpriteData(SpriteBase):
    id: str
    created_at: datetime
    updated_at: datetime

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    message: Optional[str] = None

class SpriteResponse(APIResponse):
    data: Optional[SpriteData] = None
