import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../test/test-utils";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the copyright and project name", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/Copyright/)).toBeTruthy();
    expect(
      screen.getByText("MakeCode Arcade AI Sprite Generator"),
    ).toBeTruthy();
    expect(
      screen.getByText(/Not affiliated with Microsoft/),
    ).toBeTruthy();
  });

  test("links to the GitHub repository with safe rel attributes", () => {
    renderWithProviders(<Footer />);
    const link = screen.getByRole("link", {
      name: "MakeCode-Arcade-Sprite-Generator",
    }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toContain("github.com/hobbie71");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
