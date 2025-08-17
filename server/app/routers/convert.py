from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import json
import io
import time
from datetime import datetime
from typing import Dict, Any

router = APIRouter()

@router.post("/image")
async def convert_image_to_sprite(
    image: UploadFile = File(...),
    options: str = '{"targetWidth": 16, "targetHeight": 16, "algorithm": "nearest-neighbor", "dithering": false}'
):
    """Convert uploaded image to sprite"""
    try:
        # Parse options
        conversion_options = json.loads(options)
        
        # Read and process image
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Convert to sprite (simplified for now)
        sprite_data = await _convert_image_to_sprite_data(pil_image, conversion_options)
        
        return {
            "success": True,
            "data": sprite_data,
            "message": "Image converted successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image conversion failed: {str(e)}")

async def _convert_image_to_sprite_data(image: Image.Image, options: Dict[str, Any]) -> Dict[str, Any]:
    """Convert PIL image to sprite data structure"""
    # This is a simplified version - you'll want to implement proper conversion logic
    width = options.get("targetWidth", 16)
    height = options.get("targetHeight", 16)
    
    # Resize image
    resized = image.resize((width, height), Image.NEAREST)
    
    # Convert to MakeCode colors (simplified)
    sprite_data = []
    for y in range(height):
        row = []
        for x in range(width):
            pixel = resized.getpixel((x, y))
            # Convert pixel to MakeCode color (simplified mapping)
            makecode_color = _pixel_to_makecode_color(pixel)
            row.append(makecode_color)
        sprite_data.append(row)
    
    return {
        "id": f"converted_{int(time.time())}",
        "name": "Converted Sprite",
        "width": width,
        "height": height,
        "data": sprite_data,
        "colors": list(set([color for row in sprite_data for color in row])),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

def _pixel_to_makecode_color(pixel):
    """Convert RGB pixel to MakeCode color (simplified)"""
    # This is a very basic conversion - you'll want to implement proper color mapping
    if isinstance(pixel, tuple) and len(pixel) >= 3:
        r, g, b = pixel[:3]
        # Simple brightness-based mapping
        brightness = (r + g + b) / 3
        if brightness < 32:
            return 'f'  # black
        elif brightness < 64:
            return 'e'  # brown
        elif brightness < 96:
            return '2'  # red
        elif brightness < 128:
            return '4'  # orange
        elif brightness < 160:
            return '5'  # yellow
        elif brightness < 192:
            return '7'  # green
        elif brightness < 224:
            return '8'  # blue
        else:
            return '1'  # white
    return '.'  # transparent
