// Shared design tokens + sprite data for the export-flow demo.

// --- MakeSpriteCode (new redesign) ---
export const MSC = {
  blue: "#4866E8",
  blueDark: "#3A53C4",
  ink: "#0F172A",
  slate: "#64748B",
  border: "#E2E8F0",
  bg: "#F1F3F7",
  white: "#FFFFFF",
  green: "#16A34A",
  blueTint: "#EEF2FF",
};

// --- MakeCode Arcade ---
export const MC = {
  orange: "#E2641E",
  orangeDark: "#B94E18",
  cream: "#FBF4DE",
  simTeal: "#5FB8B2",
  simTealDark: "#3F9B95",
  simScreen: "#1A1A1A",
  simBtn: "#3E3E3E",
  done: "#4CAF50",
  doneGreen: "#3FB54A",
  monacoBg: "#FFFFFF",
  gutter: "#F5F5F5",
  lineNum: "#9AA0A6",
  // Asset gallery
  assetCell: "#DCD7C2",
  addGreen: "#33A852",
  // Full-screen image editor (screenshot-accurate)
  editorBlue: "#4D6FE8",
  editorBlueDark: "#3A57C8",
  editorBg: "#161616",
  editorRail: "#000000",
  railBtn: "#2C2C2C",
  railBtnActive: "#4A4A4A",
  bottomBar: "#1C1C1C",
  checkerLight: "#C9CDD6",
  checkerDark: "#AEB3BE",
};

// MakeCode Arcade default 16-color palette (index 1..f)
export const ARCADE_PALETTE: Record<string, string> = {
  "1": "#FFFFFF",
  "2": "#FF2121",
  "3": "#FF93C4",
  "4": "#FF8135",
  "5": "#FFF609",
  "6": "#249CA3",
  "7": "#78DC52",
  "8": "#003FAD",
  "9": "#87F2FF",
  a: "#8E2EC4",
  b: "#A4839F",
  c: "#5C406C",
  d: "#E5CDC4",
  e: "#91463D",
  f: "#000000",
};

// The demo sprite: the MakeSpriteCode ninja, 32x32 (the app's favicon).
// 8 = dark blue, 1 = white, d = skin, f = black, . = transparent.
export const SPRITE: string[] = [
  "........ffffffff................",
  "......fff8888888ff.........ff...",
  ".....fff88888888888f.......f1f..",
  "....ffff888888888888f......f1f..",
  "...fffff888888888888f......f1f..",
  "...fffff8888888888888f....f11f..",
  "...fffff88888888888888....f11f..",
  "...ffffff8888888888888....f11f..",
  "..ffffffffffffffffffff...f111f..",
  "..ffffffffffffffffffff...f11f...",
  "..fffffffddffddddddfdf...f11f...",
  "..fffffffdddffddddffd8...f11f...",
  "..fffffffdddfdddddfdd8..f11f....",
  "...ffffffdddfdddddfddf..f11f....",
  "...ffffffff111111111ff..f11f....",
  "....fffff88888888888ff..f1f.....",
  ".....fffff888888888ff...f1f.....",
  "......ffffff8888888ff..f11f.....",
  "....ff888fffffffff8ffffffff.....",
  "....ff8888fffffff8888ffffff.....",
  "...f888ff888888888f88f8ffff.....",
  "..ffffffff8888888fffff8f8f......",
  "..f88ff.ffffffffffffffff8f......",
  "..f888f.f111111111f.fffff.......",
  ".ff888.ffffff11ffff...fff.......",
  ".fff8ffff88f11ff1f8f............",
  "..fff.ff888f1fff1f88f...........",
  "......ff888fffffff88f...........",
  ".....fffffff...ffffff...........",
  ".....f888ff....f888f............",
  "....ff888f.....f8888f...........",
  "....ffffff.....fffffff..........",
];

// The sprite's pixel size (width x height) — used by the resize step + badge.
export const SPRITE_W = SPRITE[0].length;
export const SPRITE_H = SPRITE.length;

// JS editor scene. MakeSpriteCode copies ONLY the img`...` template literal,
// so the animation TYPES the wrapper around a PASTE of just the literal:
//   type  -> JS_OPEN
//   paste -> img` + JS_IMG_BODY + `   (the clipboard contents)
//   type  -> JS_CLOSE
export const JS_OPEN = "let mySprite = sprites.create(";
export const JS_IMG_BODY: string[] = SPRITE.map(
  (row) => "    " + row.split("").join(" "),
);
export const JS_CLOSE = ", SpriteKind.Player)";
