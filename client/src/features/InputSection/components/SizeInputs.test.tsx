import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../test/test-utils";
import SizeInputs from "./SizeInputs";

describe("SizeInputs", () => {
  test("renders Width and Height labels", () => {
    renderWithProviders(<SizeInputs />);
    expect(screen.getByText("Width")).toBeTruthy();
    expect(screen.getByText("Height")).toBeTruthy();
  });

  test("renders two number inputs", () => {
    renderWithProviders(<SizeInputs />);
    expect(screen.getAllByRole("spinbutton").length).toBe(2);
  });

  test("editable inputs (no fixedSize) are not disabled", () => {
    renderWithProviders(<SizeInputs />);
    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs.every((i) => i.disabled === false)).toBe(true);
  });

  test("disabled prop disables both inputs", () => {
    renderWithProviders(<SizeInputs disabled />);
    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs.every((i) => i.disabled === true)).toBe(true);
  });

  test("fixedSize renders both inputs with the supplied dimensions and read-only", () => {
    renderWithProviders(<SizeInputs fixedSize={{ x: 16, y: 24 }} />);
    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    const values = inputs.map((i) => i.value).sort();
    expect(values).toEqual(["16", "24"]);
    expect(inputs.every((i) => i.readOnly === true)).toBe(true);
  });
});
