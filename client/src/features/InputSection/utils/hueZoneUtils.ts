import { getPaletteHslMap } from "../../../utils/colors/getPaletteMap";
import { hexToHsl } from "../../../utils/colors/colorConversion";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";
import { MakeCodeColor } from "../../../types/color";
import type { MakeCodePalette } from "../../../types/color";
import type { HSL } from "../../../utils/colors/colorConversion";
import type { HueZone, LuminanceZone } from "../../../types/hueZone";

/**
 * Calculate hue zones for color conversion based on palette
 */
export const calculateHueZones = (palette: MakeCodePalette): HueZone[] => {
  const paletteMap: Map<MakeCodeColor, HSL> = getPaletteHslMap(palette);
  let hueZones: HueZone[] = [];

  // Create initial palette zones
  paletteMap.forEach((hsl, color) => {
    if (color === MakeCodeColor.WHITE || color === MakeCodeColor.BLACK) return;
    hueZones.push({
      luminanceZone: getInitLuminanceZoneArray(color, hsl, palette),
      zoneStart: hsl.h,
      zoneEnd: hsl.h,
    });
  });

  // Sort zones by their initial hue value to ensure proper ordering
  hueZones.sort((a, b) => a.zoneStart - b.zoneStart);

  // Expand all hue zones until they are touching
  hueZones = expandAllHueZonesUntilTouching(hueZones);

  // Expand all luminance zones until they are touching
  expandAllLuminanceZonesUntilTouching(hueZones);

  return hueZones;
};

const getInitLuminanceZoneArray = (
  color: MakeCodeColor,
  hsl: HSL,
  palette: MakeCodePalette
): LuminanceZone[] => {
  return [
    getInitLuminanceZone(
      MakeCodeColor.BLACK,
      hexToHsl(getHexFromMakeCodeColor(MakeCodeColor.BLACK, palette))
    ),
    getInitLuminanceZone(color, hsl),
    getInitLuminanceZone(
      MakeCodeColor.WHITE,
      hexToHsl(getHexFromMakeCodeColor(MakeCodeColor.WHITE, palette))
    ),
  ];
};

const getInitLuminanceZone = (
  color: MakeCodeColor,
  hsl: HSL
): LuminanceZone => {
  const { l } = hsl;
  const luminanceZone: LuminanceZone = {
    color,
    luminance: l,
    zoneStart: l,
    zoneEnd: l,
  };
  return luminanceZone;
};

const expandAllHueZonesUntilTouching = (zones: HueZone[]): HueZone[] => {
  let hueZones = [...zones]; // Create a copy to avoid mutation
  let changed = true;
  let iterations = 0;
  const MAX_ITERATIONS = 1000; // Safety limit to prevent infinite loops

  while (changed && iterations < MAX_ITERATIONS) {
    iterations++;
    const result = expandHueZone(hueZones);
    changed = result.changed;
    hueZones = result.zones;

    // Additional safety: if we've been running too long, break
    if (iterations >= MAX_ITERATIONS) {
      console.warn(
        `Expansion stopped after ${MAX_ITERATIONS} iterations to prevent infinite loop`
      );
      break;
    }
  }

  return hueZones;
};

const expandHueZone = (
  zones: HueZone[]
): { zones: HueZone[]; changed: boolean } => {
  let hueZones = [...zones];
  let changed = false;

  hueZones.forEach((zone, idx) => {
    // Try to expand start (counter-clockwise)
    let proposedStart = zone.zoneStart - 1;
    if (proposedStart < 0) proposedStart = 359;

    // Try to expand end (clockwise)
    let proposedEnd = zone.zoneEnd + 1;
    if (proposedEnd >= 360) proposedEnd = 0;

    // Check if the proposed angle lands inside another zone; small zones
    // that meet the canCombine condition are merged into this one
    const overlapsOtherZone = (
      proposed: number,
      canCombine: (otherZone: HueZone) => boolean
    ): boolean =>
      hueZones.some((otherZone, otherIdx) => {
        if (otherIdx === idx) return false;
        if (!angleInZone(proposed, otherZone)) return false;
        if (
          zoneSpan(otherZone) < 10 &&
          zoneSpan(zone) < 10 &&
          canCombine(otherZone)
        ) {
          hueZones = combineZones(hueZones, zone, otherZone);
        }
        return true;
      });

    const startOverlaps = overlapsOtherZone(
      proposedStart,
      // Only combine if the other zone actually overlaps, not just touches
      (otherZone) =>
        angleInRange(otherZone.zoneStart, proposedStart, zone.zoneEnd) &&
        angleInRange(otherZone.zoneEnd, proposedStart, zone.zoneEnd)
    );
    const endOverlaps = overlapsOtherZone(proposedEnd, () => true);

    // Expand start if no overlap and won't enclose another zone
    if (!startOverlaps) {
      zone.zoneStart = proposedStart;
      changed = true;
    }

    // Expand end if no overlap and won't enclose another zone
    if (!endOverlaps) {
      zone.zoneEnd = proposedEnd;
      changed = true;
    }
  });

  return { zones: hueZones, changed };
};

/**
 * Zone size in degrees, handling wrap-around past 0°
 */
const zoneSpan = (zone: HueZone): number => {
  const span = zone.zoneEnd - zone.zoneStart;
  return span < 0 ? span + 360 : span;
};

/**
 * Check if an angle is within a zone, handling wrap-around
 */
const angleInZone = (angle: number, zone: HueZone): boolean => {
  return angleInRange(angle, zone.zoneStart, zone.zoneEnd);
};

/**
 * Check if an angle is within a range, handling wrap-around
 */
const angleInRange = (angle: number, start: number, end: number): boolean => {
  // Handle wrap-around case (range crosses 0°)
  if (start > end) return angle >= start || angle <= end;

  // Normal case (range doesn't cross 0°)
  return angle >= start && angle <= end;
};

/**
 * True when angle `a` sits counter-clockwise of angle `b`, taking the
 * shorter way around the hue circle
 */
const isCounterClockwiseOf = (a: number, b: number): boolean =>
  (a < b && b - a < 180) || (a > b && a - b > 180);

const combineZones = (
  zones: HueZone[],
  zone1: HueZone,
  zone2: HueZone
): HueZone[] => {
  const hueZones = [...zones];

  // Take the most counter-clockwise start and the most clockwise end
  const newStart = isCounterClockwiseOf(zone2.zoneStart, zone1.zoneStart)
    ? zone2.zoneStart
    : zone1.zoneStart;
  const newEnd = isCounterClockwiseOf(zone1.zoneEnd, zone2.zoneEnd)
    ? zone2.zoneEnd
    : zone1.zoneEnd;

  // Merge luminance zones, always white on bottom, black on top
  const luminanceZone = [...zone1.luminanceZone, ...zone2.luminanceZone];

  // Remove duplicates by color
  const uniqueLuminanceZones = luminanceZone.reduce<LuminanceZone[]>(
    (acc, lz) => {
      if (!acc.some((z) => z.color === lz.color)) acc.push(lz);
      return acc;
    },
    []
  );

  // Sort by luminance descending: brightest (highest luminance) first
  uniqueLuminanceZones.sort((a, b) => b.luminance - a.luminance).reverse();

  // Update zone1 and remove zone2
  zone1.zoneStart = newStart;
  zone1.zoneEnd = newEnd;
  zone1.luminanceZone = uniqueLuminanceZones;

  // Remove zone2 from hueZones - find and remove without mutating original
  const idx = hueZones.indexOf(zone2);
  if (idx !== -1) {
    return hueZones.filter((_, index) => index !== idx);
  }

  return hueZones;
};

const expandAllLuminanceZonesUntilTouching = (hueZones: HueZone[]): void => {
  hueZones.forEach((hueZone, hueZoneIdx) => {
    // Sort luminance zones by their initial luminance value to ensure proper ordering
    hueZone.luminanceZone.sort((a, b) => a.luminance - b.luminance);

    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 1000; // Reduced safety limit

    while (changed && iterations < MAX_ITERATIONS) {
      iterations++;
      changed = expandLuminanceZone(hueZone);

      // Early exit condition: check if zones are fully expanded
      if (!changed) {
        break;
      }

      // Check if we've reached a stable state (all zones touching or at boundaries)
      const isStable = isLuminanceZoneStable(hueZone);
      if (isStable) break;

      // Additional safety: if we've been running too long, break
      if (iterations >= MAX_ITERATIONS) {
        console.warn(
          `Luminance expansion stopped after ${MAX_ITERATIONS} iterations to prevent infinite loop for hue zone ${hueZoneIdx}`
        );
        break;
      }
    }
  });
};

const expandLuminanceZone = (hueZone: HueZone): boolean => {
  let changed = false;

  hueZone.luminanceZone.forEach((lumZone, idx) => {
    // Try to expand start (towards darker/lower luminance)
    let proposedStart = lumZone.zoneStart - 1;
    if (proposedStart < 0) proposedStart = 0; // Clamp to minimum

    // Try to expand end (towards brighter/higher luminance)
    let proposedEnd = lumZone.zoneEnd + 1;
    if (proposedEnd > 100) proposedEnd = 100; // Clamp to maximum

    // Check if expanding either boundary would overlap with any other luminance zone
    const startOverlaps = overlapsOtherLuminanceZone(
      hueZone.luminanceZone,
      idx,
      proposedStart
    );
    const endOverlaps = overlapsOtherLuminanceZone(
      hueZone.luminanceZone,
      idx,
      proposedEnd
    );

    // Special handling for boundary zones (after sorting, first = darkest, last = brightest)
    const isFirstZone = idx === 0; // Darkest zone (should extend to 0)
    const isLastZone = idx === hueZone.luminanceZone.length - 1; // Brightest zone (should extend to 100)

    // Expand start if no overlap
    if (!startOverlaps && proposedStart !== lumZone.zoneStart) {
      // For first zone, expand to 0 if not already there
      if (isFirstZone && lumZone.zoneStart > 0) {
        lumZone.zoneStart = 0;
        changed = true;
      } else if (!isFirstZone) {
        lumZone.zoneStart = proposedStart;
        changed = true;
      }
    }

    // Expand end if no overlap
    if (!endOverlaps && proposedEnd !== lumZone.zoneEnd) {
      // For last zone, expand to 100 if not already there
      if (isLastZone && lumZone.zoneEnd < 100) {
        lumZone.zoneEnd = 100;
        changed = true;
      } else if (!isLastZone) {
        lumZone.zoneEnd = proposedEnd;
        changed = true;
      }
    }
  });

  return changed;
};

/**
 * Check if a luminance value is within a range
 */
const luminanceInRange = (
  luminance: number,
  start: number,
  end: number
): boolean => {
  return luminance >= start && luminance <= end;
};

/**
 * Check if a luminance value falls inside any zone other than the one at selfIdx
 */
const overlapsOtherLuminanceZone = (
  zones: LuminanceZone[],
  selfIdx: number,
  luminance: number
): boolean =>
  zones.some(
    (otherLumZone, otherIdx) =>
      otherIdx !== selfIdx &&
      luminanceInRange(luminance, otherLumZone.zoneStart, otherLumZone.zoneEnd)
  );

const isLuminanceZoneStable = (hueZone: HueZone): boolean => {
  // Check if zones are touching each other and covering the full 0-100 range
  const sortedZones = [...hueZone.luminanceZone].sort(
    (a, b) => a.zoneStart - b.zoneStart
  );

  // First zone should start at 0, last zone should end at 100
  if (
    sortedZones[0].zoneStart !== 0 ||
    sortedZones[sortedZones.length - 1].zoneEnd !== 100
  ) {
    return false;
  }

  // Check if adjacent zones are touching (no gaps)
  for (let i = 0; i < sortedZones.length - 1; i++) {
    const currentEnd = sortedZones[i].zoneEnd;
    const nextStart = sortedZones[i + 1].zoneStart;

    // Allow zones to touch (currentEnd === nextStart) or overlap slightly
    if (currentEnd < nextStart - 1) {
      return false; // There's a gap
    }
  }

  return true;
};
