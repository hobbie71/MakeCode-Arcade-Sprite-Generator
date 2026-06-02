import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ImageImportProvider } from "./ImageImportContext";
import { useImageImports } from "./useImageImports";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ImageImportProvider>{children}</ImageImportProvider>
);

describe("ImageImportContext / useImageImports", () => {
  test("starts with no imported image", () => {
    const { result } = renderHook(() => useImageImports(), { wrapper });
    expect(result.current.importedImage).toBeNull();
  });

  test("exposes setImportedImage as a function", () => {
    const { result } = renderHook(() => useImageImports(), { wrapper });
    expect(typeof result.current.setImportedImage).toBe("function");
  });

  test("setImportedImage updates the stored file", () => {
    const { result } = renderHook(() => useImageImports(), { wrapper });
    const file = new File(["abc"], "sprite.png", { type: "image/png" });
    act(() => result.current.setImportedImage(file));
    expect(result.current.importedImage).toBe(file);
    expect(result.current.importedImage?.name).toBe("sprite.png");
  });

  test("setImportedImage replaces a previously stored file", () => {
    const { result } = renderHook(() => useImageImports(), { wrapper });
    const first = new File(["1"], "first.png", { type: "image/png" });
    const second = new File(["2"], "second.png", { type: "image/png" });
    act(() => result.current.setImportedImage(first));
    act(() => result.current.setImportedImage(second));
    expect(result.current.importedImage).toBe(second);
  });

  test("throws when used outside <ImageImportProvider>", () => {
    expect(() => renderHook(() => useImageImports())).toThrow(
      /must be used within an ImageImportProvider/,
    );
  });
});
