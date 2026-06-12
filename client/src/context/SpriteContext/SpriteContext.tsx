import { MakeCodeColor } from "../../types/color";
import { createStateContext } from "../createStateContext";

// Lazy initial so each provider mount gets its own empty grid (never a shared
// module-level array instance).
const { Context: SpriteContext, Provider: SpriteProvider } =
  createStateContext<MakeCodeColor[][]>(() => [[]]);

export { SpriteContext, SpriteProvider };
