import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../../test/test-utils";
import ToolIcons from "./ToolIcons";
import { ALL_EDITOR_TOOLS } from "../../../../types/tools";

describe("ToolIcons", () => {
  test("renders one button per editor tool", () => {
    const { container } = renderWithProviders(<ToolIcons />);
    expect(container.querySelectorAll("button").length).toBe(
      ALL_EDITOR_TOOLS.length,
    );
  });

  test("each tool's glyph icon is rendered", () => {
    const { container } = renderWithProviders(<ToolIcons />);
    for (const { icon } of ALL_EDITOR_TOOLS) {
      expect(container.querySelector(`.ms-Icon--${icon}`)).toBeTruthy();
    }
  });

  test("exposes the pencil and pan tools by name", () => {
    renderWithProviders(<ToolIcons />);
    expect(screen.getByRole("button", { name: /Pencil/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Pan/ })).toBeTruthy();
  });
});
