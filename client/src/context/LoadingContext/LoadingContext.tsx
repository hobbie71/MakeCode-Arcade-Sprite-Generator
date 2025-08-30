import React, { createContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

type LoadingContextType = {
  isGenerating: boolean;
  generationMessage: string;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationMessage: (message: string) => void;
  startGeneration: (message?: string) => void;
  stopGeneration: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMessage, setGenerationMessage] = useState<string>("");

  const startGeneration = (message: string = "Generating sprite...") => {
    setIsGenerating(true);
    setGenerationMessage(message);
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    setGenerationMessage("");
  };

  const value = useMemo(
    () => ({
      isGenerating,
      generationMessage,
      setIsGenerating,
      setGenerationMessage,
      startGeneration,
      stopGeneration,
    }),
    [isGenerating, generationMessage]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export { LoadingContext };
