import type { MakeCodePalette, Size } from "@makespritecode/shared";

// Ported from app/prompts/openai_sprite_prompt.py (OpenAI-only). Reproduced
// exactly, including the "minimum 128 x 128 pixels" clause (which has NO trailing
// space, so it runs straight into the next line) and the original typo ("seperate").

interface PromptSettings {
  prompt: string;
  assetType: string;
  style: string;
}

/** Mirrors Python's `f"{w/h}"` (str(float)): integer-valued ratios render with a
 *  trailing ".0" (e.g. 1 -> "1.0"), matching the text sent to the image model. */
export function pythonFloat(n: number): string {
  return Number.isInteger(n) ? `${n}.0` : String(n);
}

export function buildPaletteLegend(palette: MakeCodePalette): string {
  const lines: string[] = [];
  for (const hex of Object.values(palette)) {
    if (hex.toLowerCase() === "rgba(0,0,0,0)") continue; // skip transparency
    lines.push(`- ${hex.toUpperCase()}`);
  }
  return lines.join("\n");
}

export function getSpriteGenerationPrompt(
  settings: PromptSettings,
  intendedSize: Size,
  palette: MakeCodePalette,
): string {
  const assetType = settings.assetType;
  const style = settings.style;
  const aspectRatio = pythonFloat(intendedSize.width / intendedSize.height);
  const paletteLegend = buildPaletteLegend(palette);

  return (
    `You are generating pixel-art ${assetType} in a ${style} video game style. ` +
    `- Cartoon proportions, clean outlines, transparent background. ` +
    `- No photorealism, no painterly shading. ` +
    `Follow these rules for sizing and positioning: ` +
    `- Create the ${assetType} at an aspect ratio of ${aspectRatio} minimum 128 x 128 pixels` +
    `- Use cartoon proportions to get as close as you can to the aspect ratio of ${aspectRatio} ` +
    `- We are working with a very limited palette, so seperate items with different colors ` +
    `- Try to only use these colors : ` +
    `${paletteLegend}` +
    `Now, create the following sprite: ` +
    `- Type: ${assetType} ` +
    `- Style: ${style} ` +
    `- Prompt: ${settings.prompt} `
  );
}
