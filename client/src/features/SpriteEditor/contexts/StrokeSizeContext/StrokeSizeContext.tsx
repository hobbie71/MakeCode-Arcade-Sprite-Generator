import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { StrokeSize } from "../../../../types/pixel";

type StrokeSizeType = {
  strokeSize: StrokeSize;
  setStrokeSize: Dispatch<SetStateAction<StrokeSize>>;
};

const StrokeSizeContext = createContext<undefined | StrokeSizeType>(undefined);

export const StrokeSizeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [strokeSize, setStrokeSize] = useState<StrokeSize>(1);

  const contextValue = useMemo(
    () => ({ strokeSize, setStrokeSize }),
    [strokeSize]
  );

  return (
    <StrokeSizeContext.Provider value={contextValue}>
      {children}
    </StrokeSizeContext.Provider>
  );
};

export { StrokeSizeContext };
