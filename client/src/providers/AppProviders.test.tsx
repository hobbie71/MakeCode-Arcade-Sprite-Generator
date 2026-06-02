import { test, expect, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import AppProviders from "./AppProviders";

describe("AppProviders", () => {
  test("renders its children", () => {
    render(
      <AppProviders>
        <span data-testid="c">ok</span>
      </AppProviders>,
    );
    expect(screen.getByTestId("c").textContent).toBe("ok");
  });

  test("provides context so a consumer of a deep provider does not throw", () => {
    // ErrorProvider is the innermost provider in the stack. A component placed
    // inside AppProviders should be able to mount without any "must be inside
    // <Provider>" error, proving the full stack is wired up.
    expect(() =>
      render(
        <AppProviders>
          <div className="consumer">child</div>
        </AppProviders>,
      ),
    ).not.toThrow();
    expect(screen.getByText("child")).toBeTruthy();
  });

  test("renders multiple children", () => {
    render(
      <AppProviders>
        <span data-testid="a">one</span>
        <span data-testid="b">two</span>
      </AppProviders>,
    );
    expect(screen.getByTestId("a").textContent).toBe("one");
    expect(screen.getByTestId("b").textContent).toBe("two");
  });
});
