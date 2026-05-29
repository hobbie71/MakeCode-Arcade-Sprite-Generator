import React, { createContext, useState } from "react";
import type { ReactNode } from "react";
import { AiModel } from "../../types/export";

type AiModelContextType = {
  selectedModel: AiModel;
  setSelectedModel: (model: AiModel) => void;
};

const AiModelContext = createContext<AiModelContextType | undefined>(undefined);

interface AiModelProviderProps {
  children: ReactNode;
}

export const AiModelProvider: React.FC<AiModelProviderProps> = ({
  children,
}) => {
  const [selectedModel, setSelectedModel] = useState<AiModel>(
    AiModel.GPTImage1
  );

  const value = {
    selectedModel,
    setSelectedModel,
  };

  return (
    <AiModelContext.Provider value={value}>{children}</AiModelContext.Provider>
  );
};

export default AiModelContext;
