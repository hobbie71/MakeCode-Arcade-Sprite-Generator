import { ArcadePalette } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";
import { createStateContext } from "../createStateContext";

const { Context: PaletteSelectedContext, Provider: PaletteSelectedProvider } =
  createStateContext<MakeCodePalette>(ArcadePalette);

export { PaletteSelectedContext, PaletteSelectedProvider };
