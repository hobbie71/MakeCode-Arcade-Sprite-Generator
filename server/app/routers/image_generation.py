from fastapi import APIRouter
from app.models.schemas import (
    OpenAISpriteGenerationRequest,
    Size,
    OpenAIGenerationSettings,
    MakeCodePalette
)
from app.services.openai_services import OpenAIServices

router = APIRouter()

@router.post("/openai")
async def generate_sprite_openAI(request: OpenAISpriteGenerationRequest):
  settings: OpenAIGenerationSettings = request.settings
  size: Size = request.size
  palette: MakeCodePalette = request.palette

  openai = OpenAIServices()
  return await openai.generate_sprite(settings, size, palette)
