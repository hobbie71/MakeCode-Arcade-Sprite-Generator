// client/src/pages/PrivacyPage/PrivacyPage.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import PrivacyPage from "./PrivacyPage";

describe("PrivacyPage", () => {
  test("renders the heading and mentions advertising", () => {
    renderWithProviders(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /privacy policy/i }),
    ).toBeDefined();
    // The page discloses non-personalized advertising (the phrase appears in
    // both the "Advertising" and "Children" sections), so assert on getAllByText.
    expect(screen.getAllByText(/non-personalized/i).length).toBeGreaterThan(0);
  });
});
