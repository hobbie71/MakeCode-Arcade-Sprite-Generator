import { getPaletteHslMap } from "@/utils/colorUtils";
import { hexToHsl } from "@/utils/colorConversion";
import { MakeCodeColor, MakeCodePalette } from "@/types/color";
import { HSL } from "@/utils/colorConversion";
import { HueZone, LuminanceZone } from "@/types/hueZone";

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
    getInitLuminanceZone(MakeCodeColor.BLACK, hexToHsl(palette.f)),
    getInitLuminanceZone(color, hsl),
    getInitLuminanceZone(MakeCodeColor.WHITE, hexToHsl(palette[1])),
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
    // Calculate current zone size
    let zoneSize = zone.zoneEnd - zone.zoneStart;
    if (zoneSize < 0) zoneSize += 360; // Handle wrap-around

    // Try to expand start (counter-clockwise)
    let proposedStart = zone.zoneStart - 1;
    if (proposedStart < 0) proposedStart = 359;

    // Try to expand end (clockwise)
    let proposedEnd = zone.zoneEnd + 1;
    if (proposedEnd >= 360) proposedEnd = 0;

    // Check if expanding start would overlap with any other zone
    const startOverlaps = hueZones.some((otherZone, otherIdx) => {
      if (otherIdx === idx) return false;
      const isOverlap = angleInZone(proposedStart, otherZone);
      if (isOverlap) {
        const otherZoneSize =
          otherZone.zoneEnd - otherZone.zoneStart < 0
            ? 360 - otherZone.zoneStart + otherZone.zoneEnd
            : otherZone.zoneEnd - otherZone.zoneStart;
        const thisZoneSize =
          zone.zoneEnd - zone.zoneStart < 0
            ? 360 - zone.zoneStart + zone.zoneEnd
            : zone.zoneEnd - zone.zoneStart;
        // Only combine if both are small and actually overlap, not just touch
        if (
          otherZoneSize < 10 &&
          thisZoneSize < 10 &&
          angleInRange(otherZone.zoneStart, proposedStart, zone.zoneEnd) &&
          angleInRange(otherZone.zoneEnd, proposedStart, zone.zoneEnd)
        ) {
          hueZones = combineZones(hueZones, zone, otherZone);
        }
      }
      return isOverlap;
    });

    // Check if expanding end would overlap with any other zone
    const endOverlaps = hueZones.some((otherZone, otherIdx) => {
      if (otherIdx === idx) return false;
      const isOverlap = angleInZone(proposedEnd, otherZone);
      if (isOverlap) {
        const otherZoneSize =
          otherZone.zoneEnd - otherZone.zoneStart < 0
            ? 360 - otherZone.zoneStart + otherZone.zoneEnd
            : otherZone.zoneEnd - otherZone.zoneStart;
        const thisZoneSize =
          zone.zoneEnd - zone.zoneStart < 0
            ? 360 - zone.zoneStart + zone.zoneEnd
            : zone.zoneEnd - zone.zoneStart;
        if (otherZoneSize < 10 && thisZoneSize < 10) {
          hueZones = combineZones(hueZones, zone, otherZone);
        }
      }
      return isOverlap;
    });

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

const combineZones = (
  zones: HueZone[],
  zone1: HueZone,
  zone2: HueZone
): HueZone[] => {
  const hueZones = [...zones];
  const combineZone = [zone1, zone2];

  // Determine new start and end
  const starts = combineZone.map((z) => z.zoneStart);
  const ends = combineZone.map((z) => z.zoneEnd);

  // Find the most counter-clockwise start (smallest angle, considering wrap-around)
  let newStart = starts[0];
  let newEnd = ends[0];
  for (let i = 1; i < starts.length; i++) {
    if (
      (starts[i] < newStart && newStart - starts[i] < 180) ||
      (starts[i] > newStart && starts[i] - newStart > 180)
    ) {
      newStart = starts[i];
    }
    if (
      (ends[i] > newEnd && ends[i] - newEnd < 180) ||
      (ends[i] < newEnd && newEnd - ends[i] > 180)
    ) {
      newEnd = ends[i];
    }
  }

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

    // Check if expanding start would overlap with any other luminance zone
    const startOverlaps = hueZone.luminanceZone.some(
      (otherLumZone, otherIdx) => {
        if (otherIdx === idx) return false;
        return luminanceInRange(
          proposedStart,
          otherLumZone.zoneStart,
          otherLumZone.zoneEnd
        );
      }
    );

    // Check if expanding end would overlap with any other luminance zone
    const endOverlaps = hueZone.luminanceZone.some((otherLumZone, otherIdx) => {
      if (otherIdx === idx) return false;
      return luminanceInRange(
        proposedEnd,
        otherLumZone.zoneStart,
        otherLumZone.zoneEnd
      );
    });

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
