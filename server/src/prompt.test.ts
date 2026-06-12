import { test, expect, describe } from "bun:test";
import { AssetType } from "@makespritecode/shared";
import { buildPaletteLegend, getGenerationPrompt } from "./prompt";
import openaiReq from "../../fixtures/requests/openai-generate.json";

describe("buildPaletteLegend", () => {
  test("skips rgba(0,0,0,0) and uppercases hex", () => {
    expect(buildPaletteLegend({ ".": "rgba(0,0,0,0)", "1": "#ffffff", "2": "#ff2121" })).toBe(
      "- #FFFFFF\n- #FF2121",
    );
  });
});

describe("getGenerationPrompt", () => {
  const palette = openaiReq.palette;
  // JSON widens assetType to `string`; assert it back to the enum the builder wants.
  const spriteSettings = openaiReq.settings as { prompt: string; assetType: AssetType };

  test("sprite: single removable-background subject, correct framing and tail", () => {
    const p = getGenerationPrompt(spriteSettings, palette);
    expect(p.startsWith("You are generating a pixel-art sprite for a 2D video game. ")).toBe(true);
    expect(p).toContain("cartoon proportions");
    expect(p).toContain("can be cleanly removed afterward");
    expect(p.endsWith("Now create this sprite: a cute green dragon")).toBe(true);
  });

  test("background: fills the frame, no cutout, sky-gradient exception", () => {
    const p = getGenerationPrompt(
      { prompt: "a city skyline at dusk", assetType: AssetType.Background },
      palette,
    );
    expect(p).toContain("pixel-art background");
    expect(p).toContain("fills the entire frame, edge to edge");
    expect(p).toContain("a subtle gradient is acceptable only where it reads");
    expect(p).not.toContain("cleanly removed"); // sprite-only instruction
    expect(p.endsWith("Now create this background: a city skyline at dusk")).toBe(true);
  });

  test("tile: edge-to-edge texture, no subject or margin", () => {
    const p = getGenerationPrompt(
      { prompt: "mossy stone bricks", assetType: AssetType.Tile },
      palette,
    );
    expect(p).toContain("pixel-art tile");
    expect(p).toContain("repeating surface texture");
    expect(p).toContain("no border or margin");
    expect(p.endsWith("Now create this tile: mossy stone bricks")).toBe(true);
  });

  test("non-selectable types fall back to the single-subject framing", () => {
    const p = getGenerationPrompt(
      { prompt: "a walk cycle", assetType: AssetType.Animation },
      palette,
    );
    expect(p).toContain("pixel-art animation");
    expect(p).toContain("Draw a single subject");
  });

  test("sections are blank-line separated and carry the palette legend", () => {
    const p = getGenerationPrompt(spriteSettings, palette);
    expect(p).toContain("\n\nUse only these colors:\n- #FFFFFF");
  });
});
