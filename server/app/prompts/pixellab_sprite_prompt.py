def get_pixellab_sprite_generation_prompt(settings, intended_size, palette):
    """Generate a prompt for PixelLab sprite generation"""
    
    # Build the color palette string
    color_list = ", ".join(palette.colors)
    
    prompt = f"""Create a pixel art {settings.asset_type} in {settings.style} style.
    
Requirements:
- Size: {intended_size.width}x{intended_size.height} pixels
- Style: {settings.style}
- Colors: Use only these colors: {color_list}
- Clean pixel art with distinct edges
- Transparent background
- No anti-aliasing

Description: {settings.prompt}"""
    
    return prompt
