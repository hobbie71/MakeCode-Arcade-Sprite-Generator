import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../test/test-utils";
import SizeInput from "./SizeInput";

describe("SizeInput", () => {
  test("renders a number input", () => {
    renderWithProviders(<SizeInput type="width" />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe("number");
  });

  test("fixedSize renders a read-only, disabled input set to that value", () => {
    renderWithProviders(<SizeInput type="width" fixedSize={16} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("16");
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.title).toBe("This value is fixed and cannot be changed");
  });

  test("disabled (without fixedSize) marks the input disabled with a hint title", () => {
    renderWithProviders(<SizeInput type="height" disabled />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.title).toBe("This input is disabled during generation");
  });

  test("an editable input has no fixed/disabled title and is enabled", () => {
    renderWithProviders(<SizeInput type="width" />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(input.readOnly).toBe(false);
  });

  test("fixedSize adds the disabled styling class", () => {
    renderWithProviders(<SizeInput type="height" fixedSize={120} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.className).toContain("cursor-not-allowed");
  });
});
