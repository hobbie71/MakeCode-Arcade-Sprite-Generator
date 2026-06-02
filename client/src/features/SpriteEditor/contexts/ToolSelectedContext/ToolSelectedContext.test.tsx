import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ToolSelectedProvider } from "./ToolSelectedContext";
import { useToolSelected } from "./useToolSelected";
import { EditorTools } from "../../../../types/tools";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToolSelectedProvider>{children}</ToolSelectedProvider>
);

describe("ToolSelectedContext / useToolSelected", () => {
  test("defaults: tool is Pencil", () => {
    const { result } = renderHook(() => useToolSelected(), { wrapper });
    expect(result.current.tool).toBe(EditorTools.Pencil);
  });

  test("setTool updates the selected tool", () => {
    const { result } = renderHook(() => useToolSelected(), { wrapper });
    act(() => result.current.setTool(EditorTools.Eraser));
    expect(result.current.tool).toBe(EditorTools.Eraser);
    act(() => result.current.setTool(EditorTools.Fill));
    expect(result.current.tool).toBe(EditorTools.Fill);
  });

  test("setTool accepts a functional updater", () => {
    const { result } = renderHook(() => useToolSelected(), { wrapper });
    act(() =>
      result.current.setTool((prev) =>
        prev === EditorTools.Pencil ? EditorTools.Select : prev
      )
    );
    expect(result.current.tool).toBe(EditorTools.Select);
  });

  test("throws when used outside <ToolSelectedProvider>", () => {
    expect(() => renderHook(() => useToolSelected())).toThrow(
      /must be inside <ToolSelectedProvider>/
    );
  });
});
