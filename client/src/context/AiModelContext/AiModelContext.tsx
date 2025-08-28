import React, { createContext, useState, ReactNode, useCallback } from "react";
import { AiModel, AssetType } from "@/types/export";
import { getDefaultAiModelSettings } from "./getDefaultSettings";

type AiModelContextType = {
  selectedModel: AiModel;
  setSelectedModel: (model: AiModel) => void;
  setDefaultModel: (assetType: AssetType) => void;
};

const AiModelContext = createContext<AiModelContextType | undefined>(undefined);

interface AiModelProviderProps {
  children: ReactNode;
}

export const AiModelProvider: React.FC<AiModelProviderProps> = ({
  children,
}) => {
  const [selectedModel, setSelectedModel] = useState<AiModel>(AiModel.PixelLab);

  const setDefaultModel = useCallback((assetType: AssetType) => {
    setSelectedModel(getDefaultAiModelSettings(assetType));
  }, []);

  const value = {
    selectedModel,
    setSelectedModel,
    setDefaultModel,
  };

  return (
    <AiModelContext.Provider value={value}>{children}</AiModelContext.Provider>
  );
};

export default AiModelContext;
