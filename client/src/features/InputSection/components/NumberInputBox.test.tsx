import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../test/test-utils";
import NumberInputBox from "./NumberInputBox";

describe("NumberInputBox", () => {
  test("renders its label with a colon", () => {
    renderWithProviders(
      <NumberInputBox label="Tolerance" value={30} onChange={() => {}} />,
    );
    expect(screen.getByText("Tolerance:")).toBeTruthy();
  });

  test("initializes the input to the value prop", () => {
    renderWithProviders(
      <NumberInputBox label="Tolerance" value={42} onChange={() => {}} />,
    );
    const input = screen.getByLabelText("Tolerance") as HTMLInputElement;
    expect(input.value).toBe("42");
  });

  test("blur submits a clamped value via onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Tolerance"
        value={30}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Tolerance") as HTMLInputElement;
    input.value = "55";
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(55);
  });

  test("blur clamps a value above max", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    input.value = "999";
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(100);
  });

  test("blur clamps a value below min to min", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={5}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    input.value = "0";
    fireEvent.blur(input);
    // Number("0") || min -> 0 is falsy so falls back to min, then clamped to min.
    expect(onChange).toHaveBeenCalledWith(5);
  });

  test("Enter key submits the current value", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    input.value = "20";
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(20);
  });

  test("ArrowUp increments and calls onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(11);
  });

  test("ArrowDown decrements and calls onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(9);
  });

  test("ArrowUp at max does not call onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={100}
        onChange={onChange}
        min={1}
        max={100}
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test("disabled input does not submit on blur", () => {
    const onChange = mock();
    renderWithProviders(
      <NumberInputBox
        label="Size"
        value={10}
        onChange={onChange}
        min={1}
        max={100}
        disabled
      />,
    );
    const input = screen.getByLabelText("Size") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
