// client/src/pages/TermsPage/TermsPage.test.tsx
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import TermsPage from "./TermsPage";

describe("TermsPage", () => {
  test("renders the heading", () => {
    renderWithProviders(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /terms of service/i }),
    ).toBeDefined();
  });
});
