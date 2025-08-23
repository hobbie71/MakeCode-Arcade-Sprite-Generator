/**
 * Comprehensive color conversion utilities
 * Supports conversions between: HEX, RGB, RGBA, HSL, HSLA, HSV, HSVA, CMYK
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSLA extends HSL {
  a: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSVA extends HSV {
  a: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

// ============================================
// HEX CONVERSIONS
// ============================================

/**
 * Convert hex string to RGB values
 */
export function hexToRgb(hex: string): RGB {
  let normalized = hex.trim();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }
  // Expand 3-digit hex to 6-digit
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // Remove alpha if present (8 digits)
  if (normalized.length === 8) {
    normalized = normalized.slice(0, 6);
  }

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert hex string to RGBA values
 */
export function hexToRgba(hex: string): RGBA {
  let normalized = hex.trim();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }

  // Expand 3-digit hex to 6-digit
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }

  let r: number,
    g: number,
    b: number,
    a: number = 255;

  if (normalized.length === 6) {
    r = parseInt(normalized.slice(0, 2), 16);
    g = parseInt(normalized.slice(2, 4), 16);
    b = parseInt(normalized.slice(4, 6), 16);
  } else if (normalized.length === 8) {
    r = parseInt(normalized.slice(0, 2), 16);
    g = parseInt(normalized.slice(2, 4), 16);
    b = parseInt(normalized.slice(4, 6), 16);
    a = parseInt(normalized.slice(6, 8), 16);
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return { r, g, b, a };
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Convert hex to HSLA
 */
export function hexToHsla(hex: string): HSLA {
  const { r, g, b, a } = hexToRgba(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return { h, s, l, a: a / 255 };
}

/**
 * Convert hex to HSV
 */
export function hexToHsv(hex: string): HSV {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsv(r, g, b);
}

/**
 * Convert hex to HSVA
 */
export function hexToHsva(hex: string): HSVA {
  const { r, g, b, a } = hexToRgba(hex);
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a: a / 255 };
}

/**
 * Convert hex to CMYK
 */
export function hexToCmyk(hex: string): CMYK {
  const { r, g, b } = hexToRgb(hex);
  return rgbToCmyk(r, g, b);
}

// ============================================
// RGB CONVERSIONS
// ============================================

/**
 * Convert RGB to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGBA to hex string
 */
export function rgbaToHex(
  r: number,
  g: number,
  b: number,
  a: number = 255
): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  // If alpha is 255, omit it for #RRGGBB, else use #RRGGBBAA
  if (a === 255) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert RGBA to HSLA
 */
export function rgbaToHsla(
  r: number,
  g: number,
  b: number,
  a: number = 255
): HSLA {
  const { h, s, l } = rgbToHsl(r, g, b);
  return { h, s, l, a: a / 255 };
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * Convert RGBA to HSVA
 */
export function rgbaToHsva(
  r: number,
  g: number,
  b: number,
  a: number = 255
): HSVA {
  const { h, s, v } = rgbToHsv(r, g, b);
  return { h, s, v, a: a / 255 };
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// ============================================
// HSL CONVERSIONS
// ============================================

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360; // Normalize hue to 0-360
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert HSLA to RGBA
 */
export function hslaToRgba(
  h: number,
  s: number,
  l: number,
  a: number = 1
): RGBA {
  const { r, g, b } = hslToRgb(h, s, l);
  return { r, g, b, a: Math.round(a * 255) };
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

/**
 * Convert HSLA to hex
 */
export function hslaToHex(
  h: number,
  s: number,
  l: number,
  a: number = 1
): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbaToHex(r, g, b, Math.round(a * 255));
}

/**
 * Convert HSL to HSV
 */
export function hslToHsv(h: number, s: number, l: number): HSV {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHsv(r, g, b);
}

/**
 * Convert HSL to CMYK
 */
export function hslToCmyk(h: number, s: number, l: number): CMYK {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToCmyk(r, g, b);
}

// ============================================
// HSV CONVERSIONS
// ============================================

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  h = ((h % 360) + 360) % 360; // Normalize hue to 0-360
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert HSVA to RGBA
 */
export function hsvaToRgba(
  h: number,
  s: number,
  v: number,
  a: number = 1
): RGBA {
  const { r, g, b } = hsvToRgb(h, s, v);
  return { r, g, b, a: Math.round(a * 255) };
}

/**
 * Convert HSV to hex
 */
export function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

/**
 * Convert HSVA to hex
 */
export function hsvaToHex(
  h: number,
  s: number,
  v: number,
  a: number = 1
): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbaToHex(r, g, b, Math.round(a * 255));
}

/**
 * Convert HSV to HSL
 */
export function hsvToHsl(h: number, s: number, v: number): HSL {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHsl(r, g, b);
}

/**
 * Convert HSV to CMYK
 */
export function hsvToCmyk(h: number, s: number, v: number): CMYK {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToCmyk(r, g, b);
}

// ============================================
// CMYK CONVERSIONS
// ============================================

/**
 * Convert CMYK to RGB
 */
export function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * Convert CMYK to hex
 */
export function cmykToHex(c: number, m: number, y: number, k: number): string {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  return rgbToHex(r, g, b);
}

/**
 * Convert CMYK to HSL
 */
export function cmykToHsl(c: number, m: number, y: number, k: number): HSL {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  return rgbToHsl(r, g, b);
}

/**
 * Convert CMYK to HSV
 */
export function cmykToHsv(c: number, m: number, y: number, k: number): HSV {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  return rgbToHsv(r, g, b);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate color distance using Euclidean distance in RGB space
 */
export function calculateColorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHex(hex: string): boolean {
  let normalized = hex.trim();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }

  // Expand 3-digit hex to 6-digit for validation
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return /^[0-9a-f]{6}$|^[0-9a-f]{8}$/i.test(normalized);
}

/**
 * Normalize hex color to #RRGGBB or #RRGGBBAA format
 */
export function normalizeHex(hex: string): string {
  let normalized = hex.trim();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }

  // Expand 3-digit hex to 6-digit
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (!/^[0-9a-f]{6}$|^[0-9a-f]{8}$/i.test(normalized)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return "#" + normalized.toLowerCase();
}

/**
 * Get the luminance of a color (for contrast calculations)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}
