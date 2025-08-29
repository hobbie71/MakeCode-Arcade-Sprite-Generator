from app.models.enums import OpenAIGenerationSettings, Size, MakeCodePalette

SPRITE_GENERATION_PROMPT = (
  "You are generating pixel-art {asset_type} in a {style} video game style. "
  "- Cartoon proportions, clean outlines, transparent background. "
  "- No photorealism, no painterly shading. "

  "Follow these rules for sizing and positioning: "
  "- Create the {asset_type} at an aspect ratio of {aspect_ratio} minimum 128 x 128 pixels"
  "- Use cartoon proportions to get as close as you can to the aspect ratio of {aspect_ratio} "
  "- We are working with a very limited palette, so seperate items with different colors "
  "- Try to only use these colors : "

  "{palette_legend}"

  "Now, create the following sprite: "
  "- Type: {asset_type} "
  "- Style: {style} "
  "- Prompt: {user_prompt} "
)

def get_sprite_generation_prompt(settings: OpenAIGenerationSettings, intended_size: Size, palette: MakeCodePalette):
  aspect_ratio = f"{intended_size.width/intended_size.height}"
  return SPRITE_GENERATION_PROMPT.format(
    asset_type=settings.assetType.value,
    style=settings.style.value,
    aspect_ratio=aspect_ratio,
    user_prompt=settings.prompt,
    palette_legend=build_palette_legend(palette)
  )

def build_palette_legend(palette: MakeCodePalette):
  legend_lines = []
  for color_key, hex_val in palette.root.items():
    if hex_val.lower() == "rgba(0,0,0,0)":
      continue  # skip transparency
    legend_lines.append(f"- {hex_val.upper()}")
  return "\n".join(legend_lines)
