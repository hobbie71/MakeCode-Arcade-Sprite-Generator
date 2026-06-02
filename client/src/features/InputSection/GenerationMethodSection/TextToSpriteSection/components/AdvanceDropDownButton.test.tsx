import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../../test/test-utils";
import AdvanceDropDownButton from "./AdvanceDropDownButton";

describe("AdvanceDropDownButton", () => {
  test("renders the label", () => {
    renderWithProviders(
      <AdvanceDropDownButton
        isAdvanceTabOpen={false}
        setIsAdvanceTabOpen={mock()}
      />,
    );
    expect(screen.getByRole("button").textContent).toContain("Advanced Settings");
  });

  test("aria-expanded reflects the open state", () => {
    const { rerender } = renderWithProviders(
      <AdvanceDropDownButton
        isAdvanceTabOpen={false}
        setIsAdvanceTabOpen={mock()}
      />,
    );
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");

    rerender(
      <AdvanceDropDownButton
        isAdvanceTabOpen={true}
        setIsAdvanceTabOpen={mock()}
      />,
    );
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  test("clicking toggles via the functional updater", () => {
    const setIsAdvanceTabOpen = mock();
    renderWithProviders(
      <AdvanceDropDownButton
        isAdvanceTabOpen={false}
        setIsAdvanceTabOpen={setIsAdvanceTabOpen}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(setIsAdvanceTabOpen).toHaveBeenCalledTimes(1);
    // The component passes a functional updater; verify it flips the value.
    const updater = setIsAdvanceTabOpen.mock.calls[0][0] as (p: boolean) => boolean;
    expect(updater(false)).toBe(true);
    expect(updater(true)).toBe(false);
  });

  test("isGenerating disables the button and adds the disabled class", () => {
    renderWithProviders(
      <AdvanceDropDownButton
        isAdvanceTabOpen={false}
        setIsAdvanceTabOpen={mock()}
        isGenerating
      />,
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain("cursor-not-allowed");
  });

  test("the rotation indicator class toggles with open state", () => {
    const { rerender } = renderWithProviders(
      <AdvanceDropDownButton
        isAdvanceTabOpen={false}
        setIsAdvanceTabOpen={mock()}
      />,
    );
    // Closed -> indicator carries the rotate-90 class.
    let indicator = screen.getByText("▼");
    expect(indicator.className).toContain("rotate-90");

    rerender(
      <AdvanceDropDownButton
        isAdvanceTabOpen={true}
        setIsAdvanceTabOpen={mock()}
      />,
    );
    indicator = screen.getByText("▼");
    expect(indicator.className).not.toContain("rotate-90");
  });
});
