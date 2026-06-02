import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../../test/test-utils";
import OpenAISettingsSection from "./OpenAISettingsSection";

describe("OpenAISettingsSection", () => {
  test("renders the Style dropdown, the prompt input, and the advanced toggle", () => {
    renderWithProviders(<OpenAISettingsSection />);
    expect(screen.getByText("Style")).toBeTruthy();
    expect(screen.getByText("AI Image Generation Prompt")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Advanced Settings/ }),
    ).toBeTruthy();
  });

  test("Quality is hidden until the advanced section is expanded", () => {
    renderWithProviders(<OpenAISettingsSection />);
    expect(screen.queryByText("Quality")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Advanced Settings/ }));
    expect(screen.getByText("Quality")).toBeTruthy();
  });

  test("collapsing the advanced section hides Quality again", () => {
    renderWithProviders(<OpenAISettingsSection />);
    const toggle = screen.getByRole("button", { name: /Advanced Settings/ });
    fireEvent.click(toggle); // open
    expect(screen.getByText("Quality")).toBeTruthy();
    fireEvent.click(toggle); // close
    expect(screen.queryByText("Quality")).toBeNull();
  });

  test("the advanced toggle reflects its open/closed state via aria-expanded", () => {
    renderWithProviders(<OpenAISettingsSection />);
    const toggle = screen.getByRole("button", { name: /Advanced Settings/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});
