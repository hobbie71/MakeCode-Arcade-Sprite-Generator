import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../../test/test-utils";
import ImageToSpriteSection from "./ImageToSpriteSection";

describe("ImageToSpriteSection", () => {
  test("renders the upload heading and the drop zone", () => {
    renderWithProviders(<ImageToSpriteSection />);
    expect(screen.getByText("Upload Image")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Upload image file" }),
    ).toBeTruthy();
  });

  test("shows the Process Image action when no image is imported", () => {
    renderWithProviders(<ImageToSpriteSection />);
    expect(
      screen.getByRole("button", { name: "Process Image" }),
    ).toBeTruthy();
    // The "Reprocess" variant only appears once an image exists.
    expect(screen.queryByRole("button", { name: "Reprocess Image" })).toBeNull();
  });
});
