import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { PaletteSelectedProvider } from "./PaletteSelectedContext";
import { usePaletteSelected } from "./usePaletteSelected";
import { ArcadePalette, MattePalette } from "../../types/color";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PaletteSelectedProvider>{children}</PaletteSelectedProvider>
);

describe("PaletteSelectedContext / usePaletteSelected", () => {
  test("defaults to the Arcade palette", () => {
    const { result } = renderHook(() => usePaletteSelected(), { wrapper });
    expect(result.current.palette).toBe(ArcadePalette);
  });

  test("exposes setPalette as a function", () => {
    const { result } = renderHook(() => usePaletteSelected(), { wrapper });
    expect(typeof result.current.setPalette).toBe("function");
  });

  test("setPalette swaps the active palette", () => {
    const { result } = renderHook(() => usePaletteSelected(), { wrapper });
    act(() => result.current.setPalette(MattePalette));
    expect(result.current.palette).toBe(MattePalette);
    expect(result.current.palette).not.toBe(ArcadePalette);
  });

  test("setPalette accepts an updater function", () => {
    const { result } = renderHook(() => usePaletteSelected(), { wrapper });
    act(() => result.current.setPalette((prev) => (prev === ArcadePalette ? MattePalette : prev)));
    expect(result.current.palette).toBe(MattePalette);
  });

  test("throws when used outside <PaletteSelectedProvider>", () => {
    expect(() => renderHook(() => usePaletteSelected())).toThrow(
      /must be inside <PaletteSelectedProvider>/,
    );
  });
});
