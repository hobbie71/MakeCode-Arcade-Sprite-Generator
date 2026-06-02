import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import X_Button from "./X_Button";

describe("X_Button", () => {
  test("renders an accessible close button with an svg icon", () => {
    const { container } = renderWithProviders(<X_Button onClick={mock()} />);
    const btn = screen.getByRole("button", { name: "Close menu" });
    expect(btn).toBeTruthy();
    expect(container.querySelector("svg")).toBeTruthy();
  });

  test("fires onClick when clicked", () => {
    const onClick = mock();
    renderWithProviders(<X_Button onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("merges a custom className", () => {
    renderWithProviders(
      <X_Button onClick={mock()} className="absolute right-4" />,
    );
    const btn = screen.getByRole("button", { name: "Close menu" });
    expect(btn.className).toContain("absolute");
    expect(btn.className).toContain("right-4");
  });
});
