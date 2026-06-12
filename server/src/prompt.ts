import { AssetType, type MakeCodePalette } from "@makespritecode/shared";

// One builder for every asset type. The style header, palette list, and final
// instruction are shared; only the composition block changes per type (sprite vs
// background vs tile), because that's the one paragraph whose intent genuinely
// differs — a sprite needs a removable background, a background fills the frame,
// a tile is an edge-to-edge texture.

interface PromptSettings {
  prompt: string;
  assetType: AssetType;
}

export function buildPaletteLegend(palette: MakeCodePalette): string {
  const lines: string[] = [];
  for (const hex of Object.values(palette)) {
    if (hex.toLowerCase() === "rgba(0,0,0,0)") continue; // skip transparency
    lines.push(`- ${hex.toUpperCase()}`);
  }
  return lines.join("\n");
}

/** Shared, asset-type-neutral style framing prepended to every prompt. */
function styleHeader(assetType: AssetType): string {
  return (
    `You are generating a pixel-art ${assetType} for a 2D video game. ` +
    `Use clean, bold shapes with crisp edges and flat color fills — ` +
    `no anti-aliasing, no soft or painterly shading, no photorealism. ` +
    `Keep the design simple and the textures simple: favor a few large, ` +
    `readable shapes over fine detail, and minimal, low-detail textures ` +
    `over busy or intricate patterns — the low pixel resolution cannot ` +
    `resolve complex designs.`
  );
}

/** The one paragraph that differs per asset type: how to compose the frame and
 *  handle the background/edges. Tilemap and Animation aren't user-selectable, so
 *  they fall through to the sprite framing (the safe single-subject default). */
function compositionBlock(assetType: AssetType): string {
  if (assetType === AssetType.Background) {
    return (
      `This is a full background scene that fills the entire frame, edge to edge. ` +
      `There is no single subject to cut out and no empty, blank, or transparent areas — ` +
      `compose a complete scene that reaches all four edges. ` +
      `Use flat color regions; a subtle gradient is acceptable only where it reads ` +
      `naturally, such as a sky. Avoid gradients everywhere else.`
    );
  }

  if (assetType === AssetType.Tile) {
    return (
      `This is a small repeating surface texture (grass, brick, water, metal, and so on), ` +
      `not a character or object. Fill the entire frame uniformly with the texture — it ` +
      `should reach all four edges with no central subject, no border or margin, and no ` +
      `transparency. Keep every region a flat color — no gradients.`
    );
  }

  // Sprite, plus any non-selectable type (tilemap, animation): single subject.
  return (
    `Draw a single subject with cartoon proportions, centered and filling most of the ` +
    `frame. Place it on a plain, solid, single-color background that does not appear ` +
    `anywhere on the subject, so the background can be cleanly removed afterward. ` +
    `Keep every region a flat color — no gradients.`
  );
}

export function getGenerationPrompt(
  settings: PromptSettings,
  palette: MakeCodePalette,
): string {
  const { assetType, prompt } = settings;
  return [
    styleHeader(assetType),
    compositionBlock(assetType),
    `Use only these colors:\n${buildPaletteLegend(palette)}`,
    `Now create this ${assetType}: ${prompt}`,
  ].join("\n\n");
}
