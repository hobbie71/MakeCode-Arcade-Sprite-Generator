// client/src/pages/TermsPage/TermsPage.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import TermsPage from "./TermsPage";

describe("TermsPage", () => {
  test("renders the heading and the key terms", () => {
    renderWithProviders(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /terms of service/i }),
    ).toBeDefined();
    // The substantive terms must actually render, not just the heading: the
    // ads disclosure, the "as is" no-warranty clause, and the contact mailto.
    expect(screen.getByText(/non-personalized video ads/i)).toBeDefined();
    expect(screen.getByText(/as is/i)).toBeDefined();
    expect(
      screen.getByRole("link", { name: /support@makespritecode\.com/i }),
    ).toBeDefined();
  });
});
