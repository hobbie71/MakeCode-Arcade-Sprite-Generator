import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import MobileSidebar from "./MobileSidebar";

describe("MobileSidebar", () => {
  test("renders its children inside a dialog", () => {
    renderWithProviders(
      <MobileSidebar isOpen onClose={mock()}>
        <span>Sidebar content</span>
      </MobileSidebar>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(screen.getByText("Sidebar content")).toBeTruthy();
  });

  test("adds the open class only when open", () => {
    const { rerender } = renderWithProviders(
      <MobileSidebar isOpen={false} onClose={mock()}>
        <span>x</span>
      </MobileSidebar>,
    );
    expect(screen.getByRole("dialog").className.includes("open")).toBe(false);
    rerender(
      <MobileSidebar isOpen onClose={mock()}>
        <span>x</span>
      </MobileSidebar>,
    );
    expect(screen.getByRole("dialog").className).toContain("open");
  });

  test("calls onClose when clicking outside while open", () => {
    const onClose = mock();
    renderWithProviders(
      <MobileSidebar isOpen onClose={onClose}>
        <span>x</span>
      </MobileSidebar>,
    );
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when clicking inside the sidebar", () => {
    const onClose = mock();
    renderWithProviders(
      <MobileSidebar isOpen onClose={onClose}>
        <span>inside</span>
      </MobileSidebar>,
    );
    fireEvent.mouseDown(screen.getByText("inside"));
    expect(onClose).not.toHaveBeenCalled();
  });

  test("does not call onClose when closed", () => {
    const onClose = mock();
    renderWithProviders(
      <MobileSidebar isOpen={false} onClose={onClose}>
        <span>x</span>
      </MobileSidebar>,
    );
    fireEvent.mouseDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });
});
