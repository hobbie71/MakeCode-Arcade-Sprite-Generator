import { test, expect, describe } from "bun:test";
import { buildPaletteLegend, getSpriteGenerationPrompt, pythonFloat } from "./prompt";
import openaiReq from "../../fixtures/requests/openai-generate.json";
import pixellabReq from "../../fixtures/requests/pixellab-generate.json";

describe("pythonFloat", () => {
  test("integer ratios get a trailing .0", () => {
    expect(pythonFloat(1)).toBe("1.0");
    expect(pythonFloat(2)).toBe("2.0");
  });
  test("non-integers are unchanged", () => {
    expect(pythonFloat(0.5)).toBe("0.5");
    expect(pythonFloat(1.5)).toBe("1.5");
  });
});

describe("buildPaletteLegend", () => {
  test("skips rgba(0,0,0,0) and uppercases hex", () => {
    expect(buildPaletteLegend({ ".": "rgba(0,0,0,0)", "1": "#ffffff", "2": "#ff2121" })).toBe(
      "- #FFFFFF\n- #FF2121",
    );
  });
});

describe("getSpriteGenerationPrompt", () => {
  test("OpenAI variant includes min128 with NO space before '- Use'", () => {
    const p = getSpriteGenerationPrompt(openaiReq.settings, openaiReq.size, openaiReq.palette, true);
    expect(p).toContain("minimum 128 x 128 pixels- Use cartoon proportions");
    expect(p).toContain("aspect ratio of 1.0 ");
    expect(p).toContain("so seperate items with different colors");
    expect(p.startsWith("You are generating pixel-art sprite in a retro video game style. ")).toBe(true);
    expect(p.endsWith("- Prompt: a cute green dragon ")).toBe(true);
    // palette legend runs directly into "Now, create" with no separator
    expect(p).toContain("#000000Now, create the following sprite:");
  });

  test("PixelLab variant omits min128 (space before '- Use')", () => {
    const p = getSpriteGenerationPrompt(pixellabReq.settings, pixellabReq.size, pixellabReq.palette, false);
    expect(p).toContain("aspect ratio of 1.0 - Use cartoon proportions");
    expect(p).not.toContain("minimum 128 x 128");
  });
});
