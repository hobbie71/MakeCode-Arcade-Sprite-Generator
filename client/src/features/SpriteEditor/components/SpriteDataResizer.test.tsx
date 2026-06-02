import { test, expect, describe } from "bun:test";
import { renderWithProviders } from "../../../test/test-utils";
import SpriteDataResizer from "./SpriteDataResizer";

describe("SpriteDataResizer", () => {
  test("renders nothing (it is a side-effect-only component)", () => {
    const { container } = renderWithProviders(<SpriteDataResizer />);
    expect(container.textContent).toBe("");
    expect(container.querySelector("*")).toBeNull();
  });

  test("mounts without throwing inside the provider stack", () => {
    // The resize effect runs against the default 16x16 size; with no change it
    // should be a no-op and must not throw.
    expect(() => renderWithProviders(<SpriteDataResizer />)).not.toThrow();
  });
});
