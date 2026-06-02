import { test, expect, describe } from "bun:test";
import { renderWithProviders } from "../test/test-utils";
import ErrorSymbol from "./ErrorSymbol";

describe("ErrorSymbol", () => {
  test("renders an svg with the default size classes", () => {
    const { container } = renderWithProviders(<ErrorSymbol />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute("class")).toContain("w-6");
    expect(svg!.getAttribute("class")).toContain("h-6");
  });

  test("merges a custom className", () => {
    const { container } = renderWithProviders(<ErrorSymbol className="ml-2" />);
    const svg = container.querySelector("svg");
    expect(svg!.getAttribute("class")).toContain("ml-2");
  });
});
