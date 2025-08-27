from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import time
from datetime import datetime

from ..services.openai_services import OpenAIServices
from ..services.pixellab_services import PixelLabServices
from ..models.enums import OpenAIGenerationSettings, Size, MakeCodePalette

router = APIRouter()

class AIPromptRequest(BaseModel):
    text: str
    style: Optional[str] = "pixel-art"
    size: Optional[str] = "16x16"
    colors: Optional[str] = "makecode"

class OpenAIGenerateRequest(BaseModel):
    prompt: str
    asset_type: str = "sprite"
    style: str = "anime"
    size: dict
    palette: dict

@router.post("/generate")
async def generate_sprite_from_prompt(request: AIPromptRequest):
    """Generate sprite from AI prompt"""
    try:
        # This is a placeholder for AI generation
        # You'll integrate with your AI model here
        sprite_data = await _generate_sprite_with_ai(request)
        
        return {
            "success": True,
            "data": sprite_data,
            "message": "Sprite generated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI generation failed: {str(e)}")

async def _generate_sprite_with_ai(request: AIPromptRequest) -> dict:
    """Generate sprite using AI (placeholder implementation)"""
    # This is where you'll implement your AI generation logic
    # For now, return a simple placeholder sprite
    
    size_parts = request.size.split("x")
    width = int(size_parts[0])
    height = int(size_parts[1])
    
    # Create a simple pattern as placeholder
    sprite_data = []
    for y in range(height):
        row = []
        for x in range(width):
            if x == 0 or x == width-1 or y == 0 or y == height-1:
                row.append('f')  # black border
            elif x == width//2 and y == height//2:
                row.append('2')  # red center
            else:
                row.append('.')  # transparent
        sprite_data.append(row)
    
    return {
        "id": f"ai_generated_{int(time.time())}",
        "prompt": {
            "text": request.text,
            "style": request.style,
            "size": request.size,
            "colors": request.colors
        },
        "sprites": [{
            "id": f"sprite_{int(time.time())}",
            "name": f"AI Generated: {request.text[:20]}...",
            "width": width,
            "height": height,
            "data": sprite_data,
            "colors": ['f', '2', '.'],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }],
        "confidence": 85,
        "processing_time": 1500
    }

@router.post("/generate/openai")
async def generate_sprite_openAI(request: OpenAIGenerateRequest):
    """Generate sprite using OpenAI"""
    try:
        # Create service instances
        openai = OpenAIServices()
        
        # Convert request data to proper objects
        settings = OpenAIGenerationSettings(
            prompt=request.prompt,
            asset_type=request.asset_type,
            style=request.style
        )
        
        size = Size(
            width=request.size.get("width", 16),
            height=request.size.get("height", 16)
        )
        
        palette = MakeCodePalette(
            colors=request.palette.get("colors", [
                "#FFFFFF", "#FF2121", "#FF93C4", "#FF8135", "#FFF609",
                "#249CA3", "#78DC52", "#003FAD", "#87F2FF", "#8E2EC4",
                "#A4839F", "#5C406C", "#E5CDC4", "#91463D", "#000000"
            ])
        )
        
        # Generate sprite
        return await openai.generate_sprite(settings, size, palette)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI generation failed: {str(e)}")

@router.post("/generate/pixellab")
async def generate_sprite_pixellab(request: OpenAIGenerateRequest):
    """Generate sprite using PixelLab"""
    try:
        # Create service instances
        pixellab = PixelLabServices()
        
        # Convert request data to proper objects
        settings = OpenAIGenerationSettings(
            prompt=request.prompt,
            asset_type=request.asset_type,
            style=request.style
        )
        
        size = Size(
            width=request.size.get("width", 16),
            height=request.size.get("height", 16)
        )
        
        palette = MakeCodePalette(
            colors=request.palette.get("colors", [
                "#FFFFFF", "#FF2121", "#FF93C4", "#FF8135", "#FFF609",
                "#249CA3", "#78DC52", "#003FAD", "#87F2FF", "#8E2EC4",
                "#A4839F", "#5C406C", "#E5CDC4", "#91463D", "#000000"
            ])
        )
        
        # Generate sprite
        return await pixellab.generate_sprite(settings, size, palette)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PixelLab generation failed: {str(e)}")
