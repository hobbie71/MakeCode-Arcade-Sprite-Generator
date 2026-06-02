import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../test/test-utils";
import TabButton from "./TabButton";

describe("TabButton", () => {
  test("renders its children", () => {
    renderWithProviders(
      <TabButton isSelected={false} onClick={() => {}}>
        Sprite
      </TabButton>,
    );
    expect(screen.getByRole("button", { name: "Sprite" })).toBeTruthy();
  });

  test("adds the active class when selected", () => {
    renderWithProviders(
      <TabButton isSelected onClick={() => {}}>
        x
      </TabButton>,
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("tab-button");
    expect(btn.className).toContain("active");
  });

  test("omits the active class when not selected", () => {
    renderWithProviders(
      <TabButton isSelected={false} onClick={() => {}}>
        x
      </TabButton>,
    );
    expect(screen.getByRole("button").className).toContain("tab-button");
    expect(screen.getByRole("button").className.includes("active")).toBe(false);
  });

  test("click invokes onClick", () => {
    const onClick = mock();
    renderWithProviders(
      <TabButton isSelected={false} onClick={onClick}>
        x
      </TabButton>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("does not invoke onClick when disabled", () => {
    const onClick = mock();
    renderWithProviders(
      <TabButton isSelected={false} onClick={onClick} disabled>
        x
      </TabButton>,
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  test("isLoading disables the button", () => {
    renderWithProviders(
      <TabButton isSelected={false} onClick={() => {}} isLoading>
        x
      </TabButton>,
    );
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
});
