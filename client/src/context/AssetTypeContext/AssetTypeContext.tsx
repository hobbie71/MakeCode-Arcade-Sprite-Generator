import { AssetType } from "../../types/export";
import { createStateContext } from "../createStateContext";

// `null` = no asset type chosen yet. The generate card's dropdown starts empty
// and is required before AI generation; uploads / blank canvases clear it back to
// null so the Resize & Process modal only applies a preset when a type was picked.
const { Context: AssetTypeContext, Provider: AssetTypeProvider } =
  createStateContext<AssetType | null>(null);

export { AssetTypeContext, AssetTypeProvider };
