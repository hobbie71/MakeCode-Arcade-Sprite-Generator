import base64
import httpx
import io
import logging
from PIL import Image
from app.core.config import settings
from app.models.enums import OpenAIGenerationSettings, Size, MakeCodePalette
from app.prompts.pixellab_sprite_prompt import get_pixellab_sprite_generation_prompt

logger = logging.getLogger(__name__)

class PixelLabServices:
    def __init__(self):
        self.api_token = settings.PIXELLAB_API_TOKEN
        self.base_url = "https://api.pixellab.ai"  # Assuming this is the base URL
        
    async def generate_sprite(self, settings: OpenAIGenerationSettings, intended_size: Size, palette: MakeCodePalette):
        try:
            prompt = get_pixellab_sprite_generation_prompt(settings, intended_size, palette)
            
            # Prepare parameters for PixelLab API
            params = {
                "prompt": prompt,
                "width": intended_size.width,
                "height": intended_size.height,
                "style": "pixel-art",
                "format": "png"
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            
            print(f"PixelLab params: {params}")
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/generate",
                    json=params,
                    headers=headers,
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    raise Exception(f"PixelLab API error: {response.status_code} - {response.text}")
                
                result = response.json()
                
                # Assuming the API returns base64 image data
                image_data = result.get("image_data") or result.get("image")
                
                if image_data:
                    # If it's already in data URL format, return as-is
                    if image_data.startswith("data:image"):
                        return {
                            "image_data": image_data,
                            "width": intended_size.width,
                            "height": intended_size.height
                        }
                    else:
                        # Convert base64 to data URL format
                        return {
                            "image_data": f"data:image/png;base64,{image_data}",
                            "width": intended_size.width,
                            "height": intended_size.height
                        }
                else:
                    raise Exception("No image data returned from PixelLab API")
                    
        except Exception as e:
            logger.error(f"PixelLab API error: {e}")
            raise Exception(f"Failed to generate sprite with PixelLab: {str(e)}")
