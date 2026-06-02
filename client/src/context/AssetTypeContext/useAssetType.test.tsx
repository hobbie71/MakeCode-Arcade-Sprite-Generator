import { test, expect, describe } from "bun:test";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AssetTypeProvider } from "./AssetTypeContext";
import { useAssetType } from "./useAssetType";
import { AssetType } from "../../types/export";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AssetTypeProvider>{children}</AssetTypeProvider>
);

describe("AssetTypeContext / useAssetType", () => {
  test("defaults to AssetType.Sprite", () => {
    const { result } = renderHook(() => useAssetType(), { wrapper });
    expect(result.current.selectedAsset).toBe(AssetType.Sprite);
  });

  test("setSelectedAsset updates the value", () => {
    const { result } = renderHook(() => useAssetType(), { wrapper });
    act(() => result.current.setSelectedAsset(AssetType.Background));
    expect(result.current.selectedAsset).toBe(AssetType.Background);
    act(() => result.current.setSelectedAsset(AssetType.Tile));
    expect(result.current.selectedAsset).toBe(AssetType.Tile);
  });

  test("setSelectedAsset supports updater-function form", () => {
    const { result } = renderHook(() => useAssetType(), { wrapper });
    act(() => result.current.setSelectedAsset(() => AssetType.Background));
    expect(result.current.selectedAsset).toBe(AssetType.Background);
  });

  test("throws when used outside <AssetTypeProvider>", () => {
    expect(() => renderHook(() => useAssetType())).toThrow(
      /must be inside <AssetTypeProvider>/
    );
  });
});
