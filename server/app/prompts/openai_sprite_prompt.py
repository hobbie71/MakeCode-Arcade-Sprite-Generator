def get_sprite_generation_prompt(settings, intended_size, palette):
    """Generate a prompt for OpenAI sprite generation"""
    
    # Build the color palette string
    color_list = "\n".join([f"- {color}" for color in palette.colors])
    
    prompt = f"""You are generating pixel-art sprite in a {settings.style} video game style. - Cartoon proportions, clean outlines, transparent background. - No photorealism, no painterly shading. Follow these rules for sizing and positioning: - Create the sprite at an aspect ratio of {intended_size.width / intended_size.height:.1f} - Use cartoon proportions to get as close as you can to the aspect ratio of {intended_size.width / intended_size.height:.1f} - We are working with a very limited palette, so seperate items with different colors - Try to only use these colors : {color_list}Now, create the following sprite: - Type: {settings.asset_type} - Style: {settings.style} - Prompt: {settings.prompt} """
    
    return prompt
