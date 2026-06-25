import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import GenerationControls from "./GenerationControls";

describe("GenerationControls", () => {
  test("always offers Generate (no token gate)", () => {
    renderWithProviders(<GenerationControls />);
    // Exact accessible name (incl. the ★) — this is the TextToSprite tab's
    // button specifically, so the assertion also pins that tab as the default.
    expect(
      screen.getByRole("button", { name: /^✦ Generate sprite$/ }),
    ).toBeDefined();
    expect(screen.queryByText(/watch ad to earn a token/i)).toBeNull();
  });
});
