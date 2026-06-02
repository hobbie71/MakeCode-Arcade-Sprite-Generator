import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ColorSelectedProvider } from "./ColorSelectedContext";
import { useColorSelected } from "./useColorSelected";
import { MakeCodeColor } from "../../../../types/color";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ColorSelectedProvider>{children}</ColorSelectedProvider>
);

describe("ColorSelectedContext / useColorSelected", () => {
  test("defaults: color is BLACK, alternateColor is WHITE", () => {
    const { result } = renderHook(() => useColorSelected(), { wrapper });
    expect(result.current.color).toBe(MakeCodeColor.BLACK);
    expect(result.current.alternateColor).toBe(MakeCodeColor.WHITE);
  });

  test("setColor updates the primary color", () => {
    const { result } = renderHook(() => useColorSelected(), { wrapper });
    act(() => result.current.setColor(MakeCodeColor.RED));
    expect(result.current.color).toBe(MakeCodeColor.RED);
    // alternate is untouched
    expect(result.current.alternateColor).toBe(MakeCodeColor.WHITE);
  });

  test("setAlternateColor updates the alternate color", () => {
    const { result } = renderHook(() => useColorSelected(), { wrapper });
    act(() => result.current.setAlternateColor(MakeCodeColor.BLUE));
    expect(result.current.alternateColor).toBe(MakeCodeColor.BLUE);
    // primary is untouched
    expect(result.current.color).toBe(MakeCodeColor.BLACK);
  });

  test("setColor accepts a functional updater", () => {
    const { result } = renderHook(() => useColorSelected(), { wrapper });
    act(() =>
      result.current.setColor((prev) =>
        prev === MakeCodeColor.BLACK ? MakeCodeColor.GREEN : prev
      )
    );
    expect(result.current.color).toBe(MakeCodeColor.GREEN);
  });

  test("throws when used outside <ColorSelectedProvider>", () => {
    expect(() => renderHook(() => useColorSelected())).toThrow(
      /must be inside <ColorSelectedProvider>/
    );
  });
});
