import { AssetType } from "../../types/export";
import { createStateContext } from "../createStateContext";

const { Context: AssetTypeContext, Provider: AssetTypeProvider } =
  createStateContext<AssetType>(AssetType.Sprite);

export { AssetTypeContext, AssetTypeProvider };
