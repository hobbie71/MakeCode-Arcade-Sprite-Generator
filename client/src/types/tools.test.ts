import { test, expect, describe } from "bun:test";
import {
  EditorTools,
  getStrokeHotkey,
  ALL_EDITOR_TOOLS,
  getEditorToolInfo,
} from "./tools";

describe("EditorTools enum", () => {
  test("each tool carries its lowercase wire value", () => {
    expect(EditorTools.Pencil).toBe("pencil");
    expect(EditorTools.Eraser).toBe("eraser");
    expect(EditorTools.Fill).toBe("fill");
    expect(EditorTools.Line).toBe("line");
    expect(EditorTools.Rectangle).toBe("rectangle");
    expect(EditorTools.Circle).toBe("circle");
    expect(EditorTools.Select).toBe("select");
    expect(EditorTools.Pan).toBe("pan");
  });
});

describe("getStrokeHotkey", () => {
  test("maps the known stroke sizes to their bracket keys", () => {
    expect(getStrokeHotkey(1)).toBe("[");
    expect(getStrokeHotkey(3)).toBe("]");
    expect(getStrokeHotkey(5)).toBe("\\");
  });

  test("returns 'Unknown' for sizes not in the map", () => {
    expect(getStrokeHotkey(2)).toBe("Unknown");
    expect(getStrokeHotkey(0)).toBe("Unknown");
    expect(getStrokeHotkey(99)).toBe("Unknown");
  });
});

describe("ALL_EDITOR_TOOLS", () => {
  test("contains an entry for all eight editor tools", () => {
    expect(ALL_EDITOR_TOOLS.length).toBe(8);
    const tools = ALL_EDITOR_TOOLS.map((t) => t.tool);
    for (const tool of Object.values(EditorTools)) {
      expect(tools).toContain(tool);
    }
  });

  test("every entry has tool, icon, name and shortcut populated", () => {
    for (const entry of ALL_EDITOR_TOOLS) {
      expect(typeof entry.tool).toBe("string");
      expect(entry.icon.length).toBeGreaterThan(0);
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.shortcut.length).toBeGreaterThan(0);
    }
  });

  test("keyboard shortcuts are unique across tools", () => {
    const shortcuts = ALL_EDITOR_TOOLS.map((t) => t.shortcut);
    expect(new Set(shortcuts).size).toBe(shortcuts.length);
  });
});

describe("getEditorToolInfo", () => {
  test("returns the metadata for a known tool", () => {
    const info = getEditorToolInfo(EditorTools.Pencil);
    expect(info).toBeTruthy();
    expect(info?.tool).toBe(EditorTools.Pencil);
    expect(info?.name).toBe("Pencil");
    expect(info?.shortcut).toBe("P");
  });

  test("resolves a different tool correctly", () => {
    const info = getEditorToolInfo(EditorTools.Pan);
    expect(info?.icon).toBe("HandsFree");
    expect(info?.shortcut).toBe("H");
  });

  test("returns undefined for a value with no entry", () => {
    const info = getEditorToolInfo("ghost" as unknown as EditorTools);
    expect(info).toBeUndefined();
  });
});
