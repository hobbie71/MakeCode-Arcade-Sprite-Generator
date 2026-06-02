import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../../test/test-utils";
import TextToSpriteSection from "./TextToSpriteSection";

describe("TextToSpriteSection", () => {
  test("renders the AI Settings heading and the (disabled) model dropdown", () => {
    renderWithProviders(<TextToSpriteSection />);
    expect(screen.getByText("AI Settings")).toBeTruthy();
    const modelLabel = screen.getByText("AI Model");
    expect(modelLabel).toBeTruthy();
  });

  test("renders the OpenAI settings (Style + prompt) for the default model", () => {
    renderWithProviders(<TextToSpriteSection />);
    // OpenAISettingsSection only mounts for the GPTImage1 model (the default).
    expect(screen.getByText("Style")).toBeTruthy();
    expect(screen.getByText("AI Image Generation Prompt")).toBeTruthy();
  });

  test("shows the Generate New Sprite action when no image is imported", () => {
    renderWithProviders(<TextToSpriteSection />);
    expect(
      screen.getByRole("button", { name: "Generate New Sprite" }),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Reprocess Image" })).toBeNull();
  });
});
