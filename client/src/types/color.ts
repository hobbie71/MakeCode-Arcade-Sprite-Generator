import type { MakeCodePalette } from "@makespritecode/shared";

// MakeCodePalette (the wire type, Record<string,string>) is sourced from the
// shared package (ADR-0002); the MakeCodeColor enum and concrete palettes below
// stay client-side.
export type { MakeCodePalette };

// MakeCode Arcade color palette
export enum MakeCodeColor {
  TRANSPARENT = ".",
  WHITE = "1",
  RED = "2",
  PINK = "3",
  ORANGE = "4",
  YELLOW = "5",
  TEAL = "6",
  GREEN = "7",
  BLUE = "8",
  LIGHT_BLUE = "9",
  PURPLE = "a",
  LIGHT_PURPLE = "b",
  DARK_PURPLE = "c",
  TAN = "d",
  BROWN = "e",
  BLACK = "f",
}

const colorName = new Map<MakeCodeColor, string>([
  [MakeCodeColor.TRANSPARENT, "Transparent"],
  [MakeCodeColor.WHITE, "White"],
  [MakeCodeColor.RED, "Red"],
  [MakeCodeColor.PINK, "Pink"],
  [MakeCodeColor.ORANGE, "Orange"],
  [MakeCodeColor.YELLOW, "Yellow"],
  [MakeCodeColor.TEAL, "Teal"],
  [MakeCodeColor.GREEN, "Green"],
  [MakeCodeColor.BLUE, "Blue"],
  [MakeCodeColor.LIGHT_BLUE, "Light Blue"],
  [MakeCodeColor.PURPLE, "Purple"],
  [MakeCodeColor.LIGHT_PURPLE, "Light Purple"],
  [MakeCodeColor.DARK_PURPLE, "Dark Purple"],
  [MakeCodeColor.TAN, "Tan"],
  [MakeCodeColor.BROWN, "Brown"],
  [MakeCodeColor.BLACK, "Black"],
]);

export const getColorName = (color: MakeCodeColor): string => {
  return colorName.get(color) || "Unknown";
};

export const ColorOrder: MakeCodeColor[] = [
  MakeCodeColor.TRANSPARENT,
  MakeCodeColor.WHITE,
  MakeCodeColor.RED,
  MakeCodeColor.PINK,
  MakeCodeColor.ORANGE,
  MakeCodeColor.YELLOW,
  MakeCodeColor.TEAL,
  MakeCodeColor.GREEN,
  MakeCodeColor.BLUE,
  MakeCodeColor.LIGHT_BLUE,
  MakeCodeColor.PURPLE,
  MakeCodeColor.LIGHT_PURPLE,
  MakeCodeColor.DARK_PURPLE,
  MakeCodeColor.TAN,
  MakeCodeColor.BROWN,
  MakeCodeColor.BLACK,
];

export const ArcadePalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#FFFFFF",
  [MakeCodeColor.RED]: "#FF2121",
  [MakeCodeColor.PINK]: "#FF93C4",
  [MakeCodeColor.ORANGE]: "#FF8135",
  [MakeCodeColor.YELLOW]: "#FFF609",
  [MakeCodeColor.TEAL]: "#249CA3",
  [MakeCodeColor.GREEN]: "#78DC52",
  [MakeCodeColor.BLUE]: "#003FAD",
  [MakeCodeColor.LIGHT_BLUE]: "#87F2FF",
  [MakeCodeColor.PURPLE]: "#8E2EC4",
  [MakeCodeColor.LIGHT_PURPLE]: "#A4839F",
  [MakeCodeColor.DARK_PURPLE]: "#5C406C",
  [MakeCodeColor.TAN]: "#E5CDC4",
  [MakeCodeColor.BROWN]: "#91463D",
  [MakeCodeColor.BLACK]: "#000000",
};

const MattePalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#FFF1E8",
  [MakeCodeColor.RED]: "#FF004D",
  [MakeCodeColor.PINK]: "#FF77A8",
  [MakeCodeColor.ORANGE]: "#FFA300",
  [MakeCodeColor.YELLOW]: "#FFEC27",
  [MakeCodeColor.TEAL]: "#008751",
  [MakeCodeColor.GREEN]: "#00E436",
  [MakeCodeColor.BLUE]: "#29ADFF",
  [MakeCodeColor.LIGHT_BLUE]: "#C2C3C7",
  [MakeCodeColor.PURPLE]: "#7E2553",
  [MakeCodeColor.LIGHT_PURPLE]: "#83769C",
  [MakeCodeColor.DARK_PURPLE]: "#5F574F",
  [MakeCodeColor.TAN]: "#FFCCAA",
  [MakeCodeColor.BROWN]: "#AB5236",
  [MakeCodeColor.BLACK]: "#1D2B53",
};

const PastelPalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#FFF7E4",
  [MakeCodeColor.RED]: "#F98284",
  [MakeCodeColor.PINK]: "#FEAAE4",
  [MakeCodeColor.ORANGE]: "#FFC384",
  [MakeCodeColor.YELLOW]: "#FFF7A0",
  [MakeCodeColor.TEAL]: "#87A889",
  [MakeCodeColor.GREEN]: "#B0EB93",
  [MakeCodeColor.BLUE]: "#B0A9E4",
  [MakeCodeColor.LIGHT_BLUE]: "#ACCCE4",
  [MakeCodeColor.PURPLE]: "#B3E3DA",
  [MakeCodeColor.LIGHT_PURPLE]: "#D9C8BF",
  [MakeCodeColor.DARK_PURPLE]: "#6C5671",
  [MakeCodeColor.TAN]: "#FFE6C6",
  [MakeCodeColor.BROWN]: "#DEA38B",
  [MakeCodeColor.BLACK]: "#28282E",
};

const SweetPalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#F4F4F4",
  [MakeCodeColor.RED]: "#B13E53",
  [MakeCodeColor.PINK]: "#A7F070",
  [MakeCodeColor.ORANGE]: "#EF7D57",
  [MakeCodeColor.YELLOW]: "#FFCD75",
  [MakeCodeColor.TEAL]: "#257179",
  [MakeCodeColor.GREEN]: "#38B764",
  [MakeCodeColor.BLUE]: "#29366F",
  [MakeCodeColor.LIGHT_BLUE]: "#3B5DC9",
  [MakeCodeColor.PURPLE]: "#41A6F6",
  [MakeCodeColor.LIGHT_PURPLE]: "#566C86",
  [MakeCodeColor.DARK_PURPLE]: "#333C57",
  [MakeCodeColor.TAN]: "#94B0C2",
  [MakeCodeColor.BROWN]: "#5D275D",
  [MakeCodeColor.BLACK]: "#1A1C2C",
};

const PokePalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#FFFFFF",
  [MakeCodeColor.RED]: "#D45362",
  [MakeCodeColor.PINK]: "#E8958B",
  [MakeCodeColor.ORANGE]: "#CC8945",
  [MakeCodeColor.YELLOW]: "#F5DC8C",
  [MakeCodeColor.TEAL]: "#417D53",
  [MakeCodeColor.GREEN]: "#5DD48F",
  [MakeCodeColor.BLUE]: "#5162C2",
  [MakeCodeColor.LIGHT_BLUE]: "#6CADEB",
  [MakeCodeColor.PURPLE]: "#B56EDD",
  [MakeCodeColor.LIGHT_PURPLE]: "#8F3F29",
  [MakeCodeColor.DARK_PURPLE]: "#612431",
  [MakeCodeColor.TAN]: "#C0FAC2",
  [MakeCodeColor.BROWN]: "#24325E",
  [MakeCodeColor.BLACK]: "#1B1221",
};

const AdventurePalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#F5EDBA",
  [MakeCodeColor.RED]: "#9D303B",
  [MakeCodeColor.PINK]: "#D26471",
  [MakeCodeColor.ORANGE]: "#E4943A",
  [MakeCodeColor.YELLOW]: "#C0C741",
  [MakeCodeColor.TEAL]: "#647D34",
  [MakeCodeColor.GREEN]: "#34859D",
  [MakeCodeColor.BLUE]: "#17434B",
  [MakeCodeColor.LIGHT_BLUE]: "#7EC4C1",
  [MakeCodeColor.PURPLE]: "#584563",
  [MakeCodeColor.LIGHT_PURPLE]: "#8C8FAE",
  [MakeCodeColor.DARK_PURPLE]: "#3E2137",
  [MakeCodeColor.TAN]: "#D79B7D",
  [MakeCodeColor.BROWN]: "#9A6348",
  [MakeCodeColor.BLACK]: "#1F0E1C",
};
const DIYPalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#F8F8F8",
  [MakeCodeColor.RED]: "#F80000",
  [MakeCodeColor.PINK]: "#FF93C4",
  [MakeCodeColor.ORANGE]: "#F8A830",
  [MakeCodeColor.YELLOW]: "#F8F858",
  [MakeCodeColor.TEAL]: "#089050",
  [MakeCodeColor.GREEN]: "#70D038",
  [MakeCodeColor.BLUE]: "#2868C0",
  [MakeCodeColor.LIGHT_BLUE]: "#10C0C8",
  [MakeCodeColor.PURPLE]: "#C868E8",
  [MakeCodeColor.LIGHT_PURPLE]: "#C0C0C0",
  [MakeCodeColor.DARK_PURPLE]: "#787878",
  [MakeCodeColor.TAN]: "#F8D898",
  [MakeCodeColor.BROWN]: "#C04800",
  [MakeCodeColor.BLACK]: "#000000",
};

const AdafruitPalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#FFFFFF",
  [MakeCodeColor.RED]: "#FF0000",
  [MakeCodeColor.PINK]: "#FF007D",
  [MakeCodeColor.ORANGE]: "#FF7A00",
  [MakeCodeColor.YELLOW]: "#E5FF00",
  [MakeCodeColor.TEAL]: "#2D9F00",
  [MakeCodeColor.GREEN]: "#00FF72",
  [MakeCodeColor.BLUE]: "#0034FF",
  [MakeCodeColor.LIGHT_BLUE]: "#17ABFF",
  [MakeCodeColor.PURPLE]: "#C600FF",
  [MakeCodeColor.LIGHT_PURPLE]: "#636363",
  [MakeCodeColor.DARK_PURPLE]: "#7400DB",
  [MakeCodeColor.TAN]: "#00EFFF",
  [MakeCodeColor.BROWN]: "#DF2929",
  [MakeCodeColor.BLACK]: "#000000",
};

const StillLifePalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#A8E4D4",
  [MakeCodeColor.RED]: "#D13B27",
  [MakeCodeColor.PINK]: "#E07F8A",
  [MakeCodeColor.ORANGE]: "#CC8218",
  [MakeCodeColor.YELLOW]: "#B3E868",
  [MakeCodeColor.TEAL]: "#5D853A",
  [MakeCodeColor.GREEN]: "#68C127",
  [MakeCodeColor.BLUE]: "#286FB8",
  [MakeCodeColor.LIGHT_BLUE]: "#9B8BFF",
  [MakeCodeColor.PURPLE]: "#3F2811",
  [MakeCodeColor.LIGHT_PURPLE]: "#513155",
  [MakeCodeColor.DARK_PURPLE]: "#122615",
  [MakeCodeColor.TAN]: "#C7B581",
  [MakeCodeColor.BROWN]: "#7A2222",
  [MakeCodeColor.BLACK]: "#000000",
};

const SteamPunkPalette: MakeCodePalette = {
  [MakeCodeColor.TRANSPARENT]: "rgba(0,0,0,0)",
  [MakeCodeColor.WHITE]: "#C0D1CC",
  [MakeCodeColor.RED]: "#603B3A",
  [MakeCodeColor.PINK]: "#170E19",
  [MakeCodeColor.ORANGE]: "#775C4F",
  [MakeCodeColor.YELLOW]: "#77744F",
  [MakeCodeColor.TEAL]: "#4F7754",
  [MakeCodeColor.GREEN]: "#A19F7C",
  [MakeCodeColor.BLUE]: "#4F5277",
  [MakeCodeColor.LIGHT_BLUE]: "#65738C",
  [MakeCodeColor.PURPLE]: "#3A604A",
  [MakeCodeColor.LIGHT_PURPLE]: "#213B25",
  [MakeCodeColor.DARK_PURPLE]: "#433A60",
  [MakeCodeColor.TAN]: "#7C94A1",
  [MakeCodeColor.BROWN]: "#3B2137",
  [MakeCodeColor.BLACK]: "#2F213B",
};

const ALL_PALETTES = [
  { name: "Arcade", palette: ArcadePalette },
  { name: "Matte", palette: MattePalette },
  { name: "Pastel", palette: PastelPalette },
  { name: "Sweet", palette: SweetPalette },
  { name: "Poke", palette: PokePalette },
  { name: "Adventure", palette: AdventurePalette },
  { name: "DIY", palette: DIYPalette },
  { name: "Adafruit", palette: AdafruitPalette },
  { name: "StillLife", palette: StillLifePalette },
  { name: "SteamPunk", palette: SteamPunkPalette },
];

// The opaque colours of a palette, in canonical order — used to render the
// little colour-preview mosaic in the palette dropdowns (Transparent dropped).
const OPAQUE_COLOR_ORDER = ColorOrder.filter(
  (color) => color !== MakeCodeColor.TRANSPARENT
);

const getPaletteSwatches = (palette: MakeCodePalette): string[] =>
  OPAQUE_COLOR_ORDER.map((color) => palette[color]);

/** ALL_PALETTES decorated with swatch previews, ready for the dropdown. */
export const PALETTE_OPTIONS = ALL_PALETTES.map((entry) => ({
  name: entry.name,
  palette: entry.palette,
  swatches: getPaletteSwatches(entry.palette),
}));
