import { test, expect, describe, mock, spyOn, afterEach } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import IssueReportButton from "./IssueReportButton";

describe("IssueReportButton", () => {
  afterEach(() => {
    mock.restore();
  });

  test("renders a button with the report label", () => {
    renderWithProviders(<IssueReportButton />);
    const btn = screen.getByRole("button", {
      name: "Report an issue or request a feature",
    });
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain("Report Bug / Request Feature");
  });

  test("uses the danger variant styling", () => {
    renderWithProviders(<IssueReportButton />);
    const btn = screen.getByRole("button", {
      name: "Report an issue or request a feature",
    });
    expect(btn.className).toContain("btn-danger");
  });

  test("clicking opens the Google Form in a new tab", () => {
    const openSpy = spyOn(window, "open").mockImplementation(
      () => null as unknown as Window,
    );
    renderWithProviders(<IssueReportButton />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Report an issue or request a feature",
      }),
    );
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain("forms.gle");
    expect(openSpy.mock.calls[0][1]).toBe("_blank");
  });

  test("applies highlight classes when highlight is true", () => {
    renderWithProviders(<IssueReportButton highlight />);
    const btn = screen.getByRole("button", {
      name: "Report an issue or request a feature",
    });
    expect(btn.className).toContain("animate-bounce");
  });

  test("omits highlight classes by default", () => {
    renderWithProviders(<IssueReportButton />);
    const btn = screen.getByRole("button", {
      name: "Report an issue or request a feature",
    });
    expect(btn.className.includes("animate-bounce")).toBe(false);
  });
});
