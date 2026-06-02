import {
  test,
  expect,
  describe,
  mock,
  spyOn,
  afterEach,
  beforeEach,
} from "bun:test";
import { renderWithProviders, screen, fireEvent, act } from "../test/test-utils";
import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    spyOn(globalThis, "setTimeout").mockImplementation(((
      fn: () => void,
    ) => {
      fn();
      return 0 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout);
  });

  afterEach(() => {
    mock.restore();
  });

  test("renders the wrapped child", () => {
    renderWithProviders(
      <Tooltip text="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeTruthy();
  });

  test("does not show the tooltip before hover", () => {
    renderWithProviders(
      <Tooltip text="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("shows the tooltip text on mouse enter (timer flushed)", () => {
    renderWithProviders(
      <Tooltip text="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    act(() => {
      fireEvent.mouseEnter(screen.getByRole("button"));
    });
    const tip = screen.getByRole("tooltip");
    expect(tip).toBeTruthy();
    expect(tip.textContent).toContain("Help text");
  });

  test("shows the optional hotkey alongside the text", () => {
    renderWithProviders(
      <Tooltip text="Undo" hotkey="Ctrl+Z">
        <button>btn</button>
      </Tooltip>,
    );
    act(() => {
      fireEvent.mouseEnter(screen.getByRole("button"));
    });
    expect(screen.getByRole("tooltip").textContent).toContain("Ctrl+Z");
  });

  test("hides the tooltip on mouse leave", () => {
    renderWithProviders(
      <Tooltip text="Help text">
        <button>btn</button>
      </Tooltip>,
    );
    act(() => {
      fireEvent.mouseEnter(screen.getByRole("button"));
    });
    expect(screen.getByRole("tooltip")).toBeTruthy();
    act(() => {
      fireEvent.mouseLeave(screen.getByRole("button"));
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("preserves the child's own mouse handlers", () => {
    const onMouseEnter = mock();
    renderWithProviders(
      <Tooltip text="Help text">
        <button onMouseEnter={onMouseEnter}>btn</button>
      </Tooltip>,
    );
    act(() => {
      fireEvent.mouseEnter(screen.getByRole("button"));
    });
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });
});
