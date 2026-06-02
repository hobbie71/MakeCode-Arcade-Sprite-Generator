import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../test/test-utils";
import SelectedColorIcons from "./SelectedColorIcons";
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";

const ColorProbe = () => {
  const { color, alternateColor } = useColorSelected();
  return (
    <span data-testid="probe">
      {color}|{alternateColor}
    </span>
  );
};

describe("SelectedColorIcons", () => {
  test("renders a swap button with an accessible swap label", () => {
    renderWithProviders(<SelectedColorIcons />);
    const btn = screen.getByRole("button", { name: /Swap colors/ });
    expect(btn).toBeTruthy();
  });

  test("clicking swaps the primary and secondary colors", () => {
    renderWithProviders(
      <>
        <SelectedColorIcons />
        <ColorProbe />
      </>,
    );
    const before = screen.getByTestId("probe").textContent ?? "";
    const [primary, secondary] = before.split("|");
    expect(primary).not.toBe(secondary);

    fireEvent.click(screen.getByRole("button", { name: /Swap colors/ }));

    const after = screen.getByTestId("probe").textContent ?? "";
    expect(after).toBe(`${secondary}|${primary}`);
  });

  test("Enter key also swaps the colors", () => {
    renderWithProviders(
      <>
        <SelectedColorIcons />
        <ColorProbe />
      </>,
    );
    const before = screen.getByTestId("probe").textContent ?? "";
    fireEvent.keyDown(screen.getByRole("button", { name: /Swap colors/ }), {
      key: "Enter",
    });
    const after = screen.getByTestId("probe").textContent ?? "";
    expect(after).not.toBe(before);
  });
});
