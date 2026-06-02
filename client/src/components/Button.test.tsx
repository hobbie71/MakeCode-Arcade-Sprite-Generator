import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import { Button } from "./Button";

describe("Button", () => {
  test("renders its children", () => {
    renderWithProviders(<Button>Generate</Button>);
    expect(screen.getByRole("button", { name: "Generate" })).toBeTruthy();
  });

  test("maps variant to the right utility class", () => {
    const { rerender } = renderWithProviders(<Button>x</Button>);
    expect(screen.getByRole("button").className).toContain("btn-primary");
    rerender(<Button variant="secondary">x</Button>);
    expect(screen.getByRole("button").className).toContain("btn-secondary");
    rerender(<Button variant="danger">x</Button>);
    expect(screen.getByRole("button").className).toContain("btn-danger");
  });

  test("merges a custom className", () => {
    renderWithProviders(<Button className="w-full">x</Button>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  test("isLoading disables the button", () => {
    renderWithProviders(<Button isLoading>x</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });

  test("forwards onClick and other native props", () => {
    const onClick = mock();
    renderWithProviders(
      <Button type="submit" onClick={onClick}>
        go
      </Button>,
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.type).toBe("submit");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
