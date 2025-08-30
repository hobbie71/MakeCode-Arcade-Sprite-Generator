import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AssetType } from "../../types/export";

type AssetTypeContextType = {
  selectedAsset: AssetType;
  setSelectedAsset: Dispatch<SetStateAction<AssetType>>;
};

const AssetTypeContext = createContext<undefined | AssetTypeContextType>(
  undefined
);

export const AssetTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetType>(
    AssetType.Sprite
  );

  const contextValue = useMemo(
    () => ({
      selectedAsset,
      setSelectedAsset,
    }),
    [selectedAsset]
  );

  return (
    <AssetTypeContext.Provider value={contextValue}>
      {children}
    </AssetTypeContext.Provider>
  );
};

export { AssetTypeContext };
