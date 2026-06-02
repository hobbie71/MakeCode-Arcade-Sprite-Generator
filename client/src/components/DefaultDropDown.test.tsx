import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import DefaultDropDown from "./DefaultDropDown";

type Opt = { name: string };

const options: Opt[] = [
  { name: "Apple" },
  { name: "Banana" },
  { name: "Cherry" },
];

describe("DefaultDropDown", () => {
  test("renders the label and one option per entry", () => {
    renderWithProviders(
      <DefaultDropDown options={options} value={0} onChange={mock()}>
        Fruit
      </DefaultDropDown>,
    );
    expect(screen.getByText("Fruit")).toBeTruthy();
    expect(screen.getByText("Apple")).toBeTruthy();
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.getByText("Cherry")).toBeTruthy();
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  test("reflects the selected index in value", () => {
    renderWithProviders(
      <DefaultDropDown options={options} value={1} onChange={mock()}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("1");
  });

  test("change fires onChange with the numeric index", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={0} onChange={onChange}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  test("ArrowDown moves selection to the next option", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={0} onChange={onChange}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.keyDown(select, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test("ArrowUp moves selection to the previous option", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={2} onChange={onChange}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.keyDown(select, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test("ArrowDown at the last option does not fire onChange", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={2} onChange={onChange}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.keyDown(select, { key: "ArrowDown" });
    expect(onChange).not.toHaveBeenCalled();
  });

  test("type-ahead jumps to the first matching option", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={0} onChange={onChange}>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.keyDown(select, { key: "b" });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test("disabled select does not fire onChange on change or keydown", () => {
    const onChange = mock();
    renderWithProviders(
      <DefaultDropDown options={options} value={0} onChange={onChange} disabled>
        Fruit
      </DefaultDropDown>,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    fireEvent.change(select, { target: { value: "2" } });
    fireEvent.keyDown(select, { key: "ArrowDown" });
    expect(onChange).not.toHaveBeenCalled();
  });

  test("merges a custom className", () => {
    renderWithProviders(
      <DefaultDropDown
        options={options}
        value={0}
        onChange={mock()}
        className="my-custom">
        Fruit
      </DefaultDropDown>,
    );
    expect(screen.getByRole("combobox").className).toContain("my-custom");
  });
});
