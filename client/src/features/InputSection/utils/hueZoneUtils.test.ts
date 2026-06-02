import { test, expect, describe } from "bun:test";
import { calculateHueZones } from "./hueZoneUtils";
import { ArcadePalette, MattePalette, MakeCodeColor } from "../../../types/color";
import type { HueZone } from "../../../types/hueZone";

describe("calculateHueZones", () => {
  test("returns a non-empty array of hue zones for the Arcade palette", () => {
    const zones = calculateHueZones(ArcadePalette);
    expect(Array.isArray(zones)).toBe(true);
    expect(zones.length).toBeGreaterThan(0);
  });

  test("every zone has numeric hue boundaries and a luminance zone array", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      expect(typeof zone.zoneStart).toBe("number");
      expect(typeof zone.zoneEnd).toBe("number");
      expect(Array.isArray(zone.luminanceZone)).toBe(true);
      expect(zone.luminanceZone.length).toBeGreaterThan(0);
    }
  });

  test("hue boundaries stay within the 0..360 degree range", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      expect(zone.zoneStart).toBeGreaterThanOrEqual(0);
      expect(zone.zoneStart).toBeLessThan(360);
      expect(zone.zoneEnd).toBeGreaterThanOrEqual(0);
      expect(zone.zoneEnd).toBeLessThan(360);
    }
  });

  test("excludes pure WHITE and BLACK from being their own hue zones", () => {
    // WHITE and BLACK are skipped as standalone hue zones (only used as luminance
    // boundaries), so the number of hue zones is fewer than the palette size.
    const zones = calculateHueZones(ArcadePalette);
    // Arcade has 16 entries (incl. transparent); WHITE/BLACK excluded + transparent
    // (rgba) skipped by the rgb map, so zone count is well under the palette length.
    expect(zones.length).toBeLessThan(Object.keys(ArcadePalette).length);
  });

  test("each luminance zone spans the full 0..100 luminance range after expansion", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      const sorted = [...zone.luminanceZone].sort(
        (a, b) => a.zoneStart - b.zoneStart
      );
      // Darkest zone should reach 0, brightest should reach 100.
      expect(sorted[0].zoneStart).toBe(0);
      expect(sorted[sorted.length - 1].zoneEnd).toBe(100);
    }
  });

  test("luminance boundaries are clamped to 0..100", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      for (const lz of zone.luminanceZone) {
        expect(lz.zoneStart).toBeGreaterThanOrEqual(0);
        expect(lz.zoneEnd).toBeLessThanOrEqual(100);
        expect(lz.zoneStart).toBeLessThanOrEqual(lz.zoneEnd);
      }
    }
  });

  test("each hue zone's luminance zones include BLACK and WHITE anchors", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      const colors = zone.luminanceZone.map((lz) => lz.color);
      expect(colors).toContain(MakeCodeColor.BLACK);
      expect(colors).toContain(MakeCodeColor.WHITE);
    }
  });

  test("adjacent luminance zones leave no gap larger than one unit", () => {
    const zones = calculateHueZones(ArcadePalette);
    for (const zone of zones) {
      const sorted = [...zone.luminanceZone].sort(
        (a, b) => a.zoneStart - b.zoneStart
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1].zoneStart - sorted[i].zoneEnd;
        expect(gap).toBeLessThanOrEqual(1);
      }
    }
  });

  test("produces consistent zone counts for a different palette", () => {
    const zones: HueZone[] = calculateHueZones(MattePalette);
    expect(zones.length).toBeGreaterThan(0);
    for (const zone of zones) {
      const sorted = [...zone.luminanceZone].sort(
        (a, b) => a.zoneStart - b.zoneStart
      );
      expect(sorted[0].zoneStart).toBe(0);
      expect(sorted[sorted.length - 1].zoneEnd).toBe(100);
    }
  });
});
