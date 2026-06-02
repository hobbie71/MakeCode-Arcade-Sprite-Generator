import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../test/test-utils";
import StrokeIcon from "./StrokeIcon";
import { useStrokeSize } from "../../contexts/StrokeSizeContext/useStrokeSize";

const StrokeProbe = () => {
  const { strokeSize } = useStrokeSize();
  return <span data-testid="stroke">{strokeSize}</span>;
};

describe("StrokeIcon", () => {
  test("renders a button labeled with the stroke size", () => {
    renderWithProviders(<StrokeIcon strokeSize={3} />);
    expect(screen.getByRole("button", { name: "3px stroke" })).toBeTruthy();
  });

  test("mousedown on the wrapper selects that stroke size", () => {
    renderWithProviders(
      <>
        <StrokeIcon strokeSize={5} />
        <StrokeProbe />
      </>,
    );
    // The mousedown handler lives on the wrapping div around the button.
    const btn = screen.getByRole("button", { name: "5px stroke" });
    fireEvent.mouseDown(btn.parentElement as HTMLElement);
    expect(screen.getByTestId("stroke").textContent).toBe("5");
  });

  test("Enter on the button selects that stroke size", () => {
    renderWithProviders(
      <>
        <StrokeIcon strokeSize={3} />
        <StrokeProbe />
      </>,
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "3px stroke" }), {
      key: "Enter",
    });
    expect(screen.getByTestId("stroke").textContent).toBe("3");
  });

  test("marks the default stroke (1) as pressed", () => {
    renderWithProviders(<StrokeIcon strokeSize={1} />);
    const btn = screen.getByRole("button", { name: "1px stroke" });
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });
});
