import { useContext } from "react";
import { AssetTypeContext } from "./AssetTypeContext";

export const useAssetType = () => {
  const context = useContext(AssetTypeContext);
  if (!context)
    throw new Error("useAssetType must be inside <AssetTypeProvider>");
  return context;
};
