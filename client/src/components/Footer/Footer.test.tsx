// client/src/components/Footer/Footer.test.tsx
import { test, expect, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  test("links to /privacy and /terms", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /privacy/i }).getAttribute("href"),
    ).toBe("/privacy");
    expect(
      screen.getByRole("link", { name: /terms/i }).getAttribute("href"),
    ).toBe("/terms");
  });
});
