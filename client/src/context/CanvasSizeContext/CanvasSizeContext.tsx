import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

type CanvasSizeContextType = {
  width: number;
  setWidth: Dispatch<SetStateAction<number>>;
  height: number;
  setHeight: Dispatch<SetStateAction<number>>;
};

const CanvasSizeContext = createContext<undefined | CanvasSizeContextType>(
  undefined
);

export const CanvasSizeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [width, setWidth] = useState<number>(16);
  const [height, setHeight] = useState<number>(16);

  const contextValue = useMemo(
    () => ({
      width,
      setWidth,
      height,
      setHeight,
    }),
    [width, height]
  );

  return (
    <CanvasSizeContext.Provider value={contextValue}>
      {children}
    </CanvasSizeContext.Provider>
  );
};

export { CanvasSizeContext };
