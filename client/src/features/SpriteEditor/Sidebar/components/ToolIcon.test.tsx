import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../test/test-utils";
import ToolIcon from "./ToolIcon";
import { useToolSelected } from "../../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../../types/tools";

const ToolProbe = () => {
  const { tool } = useToolSelected();
  return <span data-testid="tool">{tool}</span>;
};

describe("ToolIcon", () => {
  test("renders a button with the tool name and shortcut in its label", () => {
    renderWithProviders(<ToolIcon tool={EditorTools.Eraser} icon="EraseTool" />);
    const btn = screen.getByRole("button", { name: /Eraser/ });
    expect(btn.getAttribute("aria-label")).toContain("shortcut: E");
  });

  test("renders the ms-Icon glyph for the given icon prop", () => {
    const { container } = renderWithProviders(
      <ToolIcon tool={EditorTools.Fill} icon="BucketColor" />,
    );
    expect(container.querySelector(".ms-Icon--BucketColor")).toBeTruthy();
  });

  test("mousedown selects the tool and toggles the active class", () => {
    renderWithProviders(
      <>
        <ToolIcon tool={EditorTools.Line} icon="Line" />
        <ToolProbe />
      </>,
    );
    const btn = screen.getByRole("button", { name: /Line/ });
    expect(btn.className).not.toContain("active");
    fireEvent.mouseDown(btn);
    expect(screen.getByTestId("tool").textContent).toBe(EditorTools.Line);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(btn.className).toContain("active");
  });

  test("the default pencil tool starts pressed", () => {
    renderWithProviders(<ToolIcon tool={EditorTools.Pencil} icon="PencilReply" />);
    const btn = screen.getByRole("button", { name: /Pencil/ });
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });
});
