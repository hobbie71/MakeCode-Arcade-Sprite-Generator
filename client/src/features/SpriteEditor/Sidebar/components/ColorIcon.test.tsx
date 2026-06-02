import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../test/test-utils";
import ColorIcon from "./ColorIcon";
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor, ArcadePalette } from "../../../../types/color";

const ColorProbe = () => {
  const { color } = useColorSelected();
  return <span data-testid="selected">{color}</span>;
};

describe("ColorIcon", () => {
  test("renders a swatch button with an accessible label for a named color", () => {
    renderWithProviders(<ColorIcon color={MakeCodeColor.RED} palette={ArcadePalette} />);
    const btn = screen.getByRole("button", { name: /Select Red/ });
    expect(btn).toBeTruthy();
    // Named colors get the palette hex as their background.
    expect((btn as HTMLButtonElement).style.backgroundColor).toBeTruthy();
  });

  test("labels the transparent color as Transparent and marks it with the class", () => {
    renderWithProviders(
      <ColorIcon color={MakeCodeColor.TRANSPARENT} palette={ArcadePalette} />,
    );
    const btn = screen.getByRole("button", { name: /Select Transparent/ });
    expect(btn).toBeTruthy();
    expect(btn.className).toContain("transparent");
  });

  test("clicking the swatch selects that color (aria-pressed + context)", () => {
    renderWithProviders(
      <>
        <ColorIcon color={MakeCodeColor.GREEN} palette={ArcadePalette} />
        <ColorProbe />
      </>,
    );
    const btn = screen.getByRole("button", { name: /Select Green/ });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("selected").textContent).toBe(MakeCodeColor.GREEN);
  });

  test("keyboard Enter selects the color", () => {
    renderWithProviders(
      <>
        <ColorIcon color={MakeCodeColor.BLUE} palette={ArcadePalette} />
        <ColorProbe />
      </>,
    );
    const btn = screen.getByRole("button", { name: /Select Blue/ });
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(screen.getByTestId("selected").textContent).toBe(MakeCodeColor.BLUE);
  });
});
