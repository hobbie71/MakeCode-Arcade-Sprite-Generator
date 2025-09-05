from fastapi import APIRouter
from app.models.schemas import (
    PixelLabSpriteGenerationRequest, 
    OpenAISpriteGenerationRequest, 
    Size, 
    PixelLabGenerationSettings, 
    OpenAIGenerationSettings, 
    MakeCodePalette
)
from app.services.pixellab_services import PixelLabServices
from app.services.openai_services import OpenAIServices

router = APIRouter()

@router.post("/pixellab")
async def generate_sprite_pixellab(request: PixelLabSpriteGenerationRequest):
  settings: PixelLabGenerationSettings = request.settings
  size: Size = request.size
  palette: MakeCodePalette = request.palette

  pixelLab = PixelLabServices()
  return await pixelLab.generate_sprite(settings, size, palette)

@router.post("/openai")
async def generate_sprite_openAI(request: OpenAISpriteGenerationRequest):
  settings: OpenAIGenerationSettings = request.settings
  size: Size = request.size
  palette: MakeCodePalette = request.palette

  openai = OpenAIServices()
  return await openai.generate_sprite(settings, size, palette)
