import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../test/test-utils";
import GenerationMethodSection from "./GenerationMethodSection";

describe("GenerationMethodSection", () => {
  test("renders the heading and a tab for each generation method", () => {
    renderWithProviders(<GenerationMethodSection />);
    expect(screen.getByText("Generation Method")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Text to Sprite" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Image to Sprite" }),
    ).toBeTruthy();
  });

  test("defaults to the Text to Sprite panel (AI Settings visible)", () => {
    renderWithProviders(<GenerationMethodSection />);
    expect(screen.getByText("AI Settings")).toBeTruthy();
    // Image upload panel is not mounted by default.
    expect(screen.queryByText("Upload Image")).toBeNull();
  });

  test("clicking the Image tab switches to the upload panel", () => {
    renderWithProviders(<GenerationMethodSection />);
    fireEvent.click(screen.getByRole("button", { name: "Image to Sprite" }));
    expect(screen.getByText("Upload Image")).toBeTruthy();
    expect(screen.queryByText("AI Settings")).toBeNull();
  });

  test("clicking back to the Text tab restores the AI Settings panel", () => {
    renderWithProviders(<GenerationMethodSection />);
    fireEvent.click(screen.getByRole("button", { name: "Image to Sprite" }));
    fireEvent.click(screen.getByRole("button", { name: "Text to Sprite" }));
    expect(screen.getByText("AI Settings")).toBeTruthy();
    expect(screen.queryByText("Upload Image")).toBeNull();
  });
});
