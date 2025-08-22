// Quick test to verify colorUtils functions never return undefined
import {
  hexToMakeCodeColor,
  rgbaToMakeCodeColor,
} from "./client/src/utils/colorUtils.ts";
import { ArcadePalette, MattePalette } from "./client/src/types/color.ts";

console.log("Testing colorUtils functions...");

// Test cases that previously would return undefined
const testCases = [
  "#INVALID", // Invalid hex
  "#12", // Too short
  "#12345678", // 8 digits (with alpha)
  "#999999", // Color not in palette
  "#808080", // Another color not in exact palette
  "", // Empty string
  "not-a-hex", // Invalid format
];

console.log("\nTesting hexToMakeCodeColor with ArcadePalette:");
testCases.forEach((hex) => {
  const result = hexToMakeCodeColor(hex, ArcadePalette);
  console.log(
    `  ${hex} -> ${result} (${result !== undefined ? "OK" : "FAIL"})`
  );
});

console.log("\nTesting hexToMakeCodeColor with MattePalette:");
testCases.forEach((hex) => {
  const result = hexToMakeCodeColor(hex, MattePalette);
  console.log(
    `  ${hex} -> ${result} (${result !== undefined ? "OK" : "FAIL"})`
  );
});

console.log("\nTesting rgbaToMakeCodeColor:");
const rgbaTestCases = [
  [255, 255, 255, 255], // White
  [0, 0, 0, 255], // Black
  [128, 128, 128, 255], // Gray (not in palette)
  [255, 0, 0, 0], // Transparent red
  [100, 150, 200, 128], // Semi-transparent
];

rgbaTestCases.forEach(([r, g, b, a]) => {
  const result = rgbaToMakeCodeColor(r, g, b, a, ArcadePalette);
  console.log(
    `  rgba(${r}, ${g}, ${b}, ${a}) -> ${result} (${result !== undefined ? "OK" : "FAIL"})`
  );
});

console.log("\nAll tests completed!");
