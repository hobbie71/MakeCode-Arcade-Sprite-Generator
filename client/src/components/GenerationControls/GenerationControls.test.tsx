import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import GenerationControls from "./GenerationControls";

describe("GenerationControls", () => {
  test("always offers Generate (no token gate)", () => {
    renderWithProviders(<GenerationControls />);
    expect(screen.getByRole("button", { name: /generate sprite/i })).toBeDefined();
    expect(screen.queryByText(/watch ad to earn a token/i)).toBeNull();
  });
});
