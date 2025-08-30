import httpx
from app.core.config import settings
import pixellab
import logging
from app.models.enums import PixelLabGenerationSettings, Size, MakeCodePalette
from app.prompts.pixellab_sprite_prompt import get_sprite_generation_prompt
import io
import base64

logger = logging.getLogger(__name__)

class PixelLabServices:
  def __init__(self):
    self.api_key = settings.PIXELLAB_API_KEY
    self.client = pixellab.Client(secret=self.api_key)

  def get_final_size(self, size: Size, fitFullCanvasSize: bool) -> Size:
    if fitFullCanvasSize:
      return size
    
    # Calculate minimum size (at least double the largest dimension, minimum 32)
    max_dimension = max(size.width, size.height)
    min_target_size = max(32, max_dimension * 2)
    
    # Calculate aspect ratio
    aspect_ratio = size.width / size.height
    
    # Preferred sizes in order of preference (smaller first for performance/cost)
    preferred_sizes = [128, 320, 400]
    
    # Find the smallest preferred size that can accommodate our minimum target
    target_size = None
    for pref_size in preferred_sizes:
      if pref_size >= min_target_size:
        target_size = pref_size
        break
    
    # If no preferred size is large enough, use the minimum target size (capped at 400)
    if target_size is None:
      target_size = min(min_target_size, 400)
    
    # Calculate final dimensions maintaining aspect ratio
    if aspect_ratio >= 1:  # Width >= Height
      final_width = target_size
      final_height = round(target_size / aspect_ratio)
    else:  # Height > Width
      final_height = target_size
      final_width = round(target_size * aspect_ratio)
    
    # Ensure minimum dimensions of 32 and maximum of 400
    final_width = max(32, min(400, final_width))
    final_height = max(32, min(400, final_height))
    
    return Size(width=final_width, height=final_height)

  async def generate_sprite(self, settings: PixelLabGenerationSettings, intended_size: Size, palette: MakeCodePalette):
    try:
      final_size = self.get_final_size(intended_size, settings.fitFullCanvasSize)

      params = {
        "description": get_sprite_generation_prompt(settings, intended_size, palette),
        "image_size": {
          "width": str(final_size.width),
          "height": str(final_size.height),
        },
        "no_background": not settings.addBackground,
      }
      
      # Add PixelLab specific parameters only if they are not empty/auto
      if settings.quality.value and settings.quality.value.strip():
        params["quality"] = settings.quality.value
      
      if settings.view.value and settings.view.value.strip():
        params["view"] = settings.view.value

      if settings.outline.value and settings.outline.value.strip():
        params["outline"] = settings.outline.value

      if settings.direction.value and settings.direction.value.strip():
        params["direction"] = settings.direction.value

      response = self.client.generate_image_pixflux(**params)
      image = response.image.pil_image()
      
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
      logger.error(f"PixelLab API error: {e}")
      raise Exception(f"Failed to generate sprite: {str(e)}")
