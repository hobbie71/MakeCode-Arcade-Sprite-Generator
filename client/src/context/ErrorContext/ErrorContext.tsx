import { createContext, useState, useMemo } from "react";

type ErrorContextType = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const ErrorContext = createContext<undefined | ErrorContextType>(undefined);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const contextValue = useMemo(
    () => ({
      error,
      setError,
    }),
    [error]
  );

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContext };
