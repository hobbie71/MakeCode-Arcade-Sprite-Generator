import React, { createContext, useState, ReactNode } from "react";

// Type imports
import { GenerationMethod } from "@/types/export";

type GenerationMethodContextType = {
  selectedMethod: GenerationMethod;
  setSelectedMethod: (method: GenerationMethod) => void;
};

const GenerationMethodContext = createContext<
  GenerationMethodContextType | undefined
>(undefined);

interface GenerationMethodProviderProps {
  children: ReactNode;
}

export const GenerationMethodProvider: React.FC<
  GenerationMethodProviderProps
> = ({ children }) => {
  const [selectedMethod, setSelectedMethod] = useState<GenerationMethod>(
    GenerationMethod.TextToSprite
  );

  const value = {
    selectedMethod,
    setSelectedMethod,
  };

  return (
    <GenerationMethodContext.Provider value={value}>
      {children}
    </GenerationMethodContext.Provider>
  );
};

export default GenerationMethodContext;
