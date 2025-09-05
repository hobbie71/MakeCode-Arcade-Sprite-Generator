import base64
import httpx
import io
import logging
from PIL import Image
from openai import OpenAI
from app.core.config import settings
from app.models.enums import OpenAIGenerationSettings, Size, MakeCodePalette, OpenAIFinalSize
from app.prompts.openai_sprite_prompt import get_sprite_generation_prompt

logger = logging.getLogger(__name__)

class OpenAIServices:
  def __init__(self):
    self.api_key = settings.OPENAI_API_KEY
    self.client = OpenAI(api_key=self.api_key)

  def get_final_size(self, intended_size: Size) -> OpenAIFinalSize:
    """
    Determine the best OpenAI image size based on aspect ratio.
    OpenAI supports: 1024x1024 (square), 1536x1024 (landscape), 1024x1536 (portrait)
    """
    aspect_ratio = intended_size.width / intended_size.height
    
    # Define aspect ratio thresholds
    square_threshold = 1.2  # If ratio is between 1/1.2 and 1.2, use square
    
    if aspect_ratio >= square_threshold:
      # Landscape orientation
      return OpenAIFinalSize.Landscape
    elif aspect_ratio <= (1 / square_threshold):
      # Portrait orientation  
      return OpenAIFinalSize.Portrait
    else:
      # Close to square
      return OpenAIFinalSize.Square

  async def generate_sprite(self, settings: OpenAIGenerationSettings, intended_size: Size, palette: MakeCodePalette):
    try:
      final_size = self.get_final_size(intended_size)
      
      # Prepare parameters for OpenAI API
      params = {
        "model": "gpt-image-1",
        "prompt": get_sprite_generation_prompt(settings, intended_size, palette),
        "n": 1,
        "size": final_size.value,
      }
      
      # Only add quality if it's not the default auto value
      if settings.quality.value and settings.quality.value.strip():
        params["quality"] = settings.quality.value
      
      # Generate image using OpenAI
      response = self.client.images.generate(**params)
      
      # Get the base64 image data
      image_b64 = response.data[0].b64_json
      
      # Decode and process the image
      image_bytes = base64.b64decode(image_b64)
      image = Image.open(io.BytesIO(image_bytes))
      
      # Convert back to base64
      buffer = io.BytesIO()
      image.save(buffer, format='PNG')
      buffer.seek(0)
      
      image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
      
      return {
        "image_data": f"data:image/png;base64,{image_base64}",
        "width": image.width,
        "height": image.height
      }
      
    except Exception as e:
      logger.error(f"OpenAI API error: {e}")
      raise Exception(f"Failed to generate sprite: {str(e)}")
  
  async def get_moderate_prompt(self, prompt: str):
    response = self.client.moderations.create(
      model="omni-moderation-latest",
      input=prompt,
    )

    return response
