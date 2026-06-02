import { test, expect, describe, mock } from "bun:test";

// CodeDisplay (rendered by ExportSection) pulls in prismjs + its python grammar
// and a CSS theme via side-effect imports. Stub them so the tree mounts cleanly
// under happy-dom.
mock.module("prismjs", () => ({ default: { highlightElement: () => {} } }));
mock.module("prismjs/components/prism-python", () => ({}));
mock.module("prismjs/themes/prism.css", () => ({}));

import {
  renderWithProviders,
  screen,
  within,
} from "../../test/test-utils";
import ExportSection from "./ExportSection";

describe("ExportSection", () => {
  test("renders the two export section headings", () => {
    renderWithProviders(<ExportSection />);
    expect(screen.getByText("Export Sprite Image")).toBeTruthy();
    expect(screen.getByText("Export Sprite Code")).toBeTruthy();
  });

  test("renders a download button for every image export format", () => {
    renderWithProviders(<ExportSection />);
    expect(screen.getByText("Download as PNG")).toBeTruthy();
    expect(screen.getByText("Download as JPEG")).toBeTruthy();
    expect(screen.getByText("Download as WEBP")).toBeTruthy();
  });

  test("renders the three code export cards with their labels", () => {
    renderWithProviders(<ExportSection />);
    expect(screen.getByText("Sprite Editor Code")).toBeTruthy();
    expect(screen.getByText("Javascript Code")).toBeTruthy();
    expect(screen.getByText("Python Code")).toBeTruthy();
  });

  test("renders three copyable code regions (one per code format)", () => {
    renderWithProviders(<ExportSection />);
    // Each CodeDisplay exposes its <pre> as role="button"; the three image
    // ExportButtons are real <button>s — so role=button covers both.
    const buttons = screen.getAllByRole("button");
    // 3 image download buttons + 3 code-display copy regions = 6
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  test("the sprite-editor code card renders generated img`` literal code", () => {
    renderWithProviders(<ExportSection />);
    const heading = screen.getByText("Sprite Editor Code");
    const card = heading.parentElement as HTMLElement;
    // getImgCode() always begins with the makecode `img` token.
    expect(within(card).getByRole("button").textContent).toContain("img");
  });

  test("the python card emits arcade_sprites.create_sprite code", () => {
    renderWithProviders(<ExportSection />);
    const heading = screen.getByText("Python Code");
    const card = heading.parentElement as HTMLElement;
    expect(within(card).getByRole("button").textContent).toContain(
      "create_sprite",
    );
  });

  test("renders the MakeCode copy/paste helper hint", () => {
    renderWithProviders(<ExportSection />);
    expect(
      screen.getByText(/Copy .* and Paste .* code into MakeCode Arcade/),
    ).toBeTruthy();
  });
});
