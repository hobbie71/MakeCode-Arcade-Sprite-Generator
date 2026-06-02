import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import SpriteEditor from "./SpriteEditor";

describe("SpriteEditor", () => {
  test("mounts the full editor (sidebar + canvas) without throwing", () => {
    const { container } = renderWithProviders(<SpriteEditor />);
    // Sidebar toolbox.
    expect(container.querySelector(".toolbox")).toBeTruthy();
    // Canvas container + a <canvas> element.
    expect(container.querySelector(".canvas-container")).toBeTruthy();
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  test("wires its own provider so sidebar tool controls render", () => {
    renderWithProviders(<SpriteEditor />);
    // A tool button proves the SpriteEditorProvider contexts are available.
    expect(screen.getByRole("button", { name: /Pencil/ })).toBeTruthy();
  });
});
