import { test, expect, describe } from "bun:test";
import { AssetType, AssetTypeSchema } from "./enums";

describe("AssetType", () => {
  test("enum members carry the wire string values", () => {
    expect(AssetType.Sprite).toBe("sprite");
    expect(AssetType.Background).toBe("background");
    expect(AssetType.Tile).toBe("tile");
    expect(AssetType.Tilemap).toBe("tilemap");
    expect(AssetType.Animation).toBe("animation");
  });

  test("schema accepts every member and rejects unknown strings", () => {
    for (const value of Object.values(AssetType)) {
      expect(AssetTypeSchema.parse(value)).toBe(value);
    }
    expect(AssetTypeSchema.safeParse("spaceship").success).toBe(false);
    expect(AssetTypeSchema.safeParse("Sprite").success).toBe(false); // case-sensitive
  });
});
