import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../test/test-utils";
import CheckBox from "./CheckBox";

describe("CheckBox", () => {
  test("renders its label", () => {
    renderWithProviders(
      <CheckBox checked={false} onChange={() => {}}>
        Remove Background
      </CheckBox>,
    );
    expect(screen.getByText("Remove Background")).toBeTruthy();
  });

  test("reflects the checked prop on the switch input", () => {
    renderWithProviders(
      <CheckBox checked onChange={() => {}}>
        x
      </CheckBox>,
    );
    const input = screen.getByRole("switch") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  test("firing change calls onChange with the new value", () => {
    const onChange = mock();
    renderWithProviders(
      <CheckBox checked={false} onChange={onChange}>
        x
      </CheckBox>,
    );
    const input = screen.getByRole("switch") as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("clicking the visual toggle calls onChange with the inverse of checked", () => {
    const onChange = mock();
    const { container } = renderWithProviders(
      <CheckBox checked onChange={onChange}>
        x
      </CheckBox>,
    );
    // The visual oval is a role="presentation" span (hidden from the a11y tree),
    // so query it directly from the DOM.
    const presentation = container.querySelector(
      'span[role="presentation"]',
    ) as HTMLSpanElement;
    expect(presentation).toBeTruthy();
    fireEvent.click(presentation);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test("Enter key on the input toggles via onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <CheckBox checked={false} onChange={onChange}>
        x
      </CheckBox>,
    );
    const input = screen.getByRole("switch");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("disabled checkbox does not fire onChange on change event", () => {
    const onChange = mock();
    renderWithProviders(
      <CheckBox checked={false} onChange={onChange} disabled>
        x
      </CheckBox>,
    );
    const input = screen.getByRole("switch") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    // Fire a change event directly; handleChange returns early when disabled.
    fireEvent.change(input, { target: { checked: true } });
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test("disabled checkbox ignores keyboard toggles", () => {
    const onChange = mock();
    renderWithProviders(
      <CheckBox checked={false} onChange={onChange} disabled>
        x
      </CheckBox>,
    );
    const input = screen.getByRole("switch");
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: " " });
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
