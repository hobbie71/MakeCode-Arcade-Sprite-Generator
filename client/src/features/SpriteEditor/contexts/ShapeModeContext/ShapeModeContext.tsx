import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

export type ShapeMode = "outline" | "fill";

type ShapeModeContextType = {
  /** Whether Rectangle/Circle draw a filled shape or just the outline. */
  shapeMode: ShapeMode;
  setShapeMode: Dispatch<SetStateAction<ShapeMode>>;
};

const ShapeModeContext = createContext<undefined | ShapeModeContextType>(
  undefined
);

export const ShapeModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shapeMode, setShapeMode] = useState<ShapeMode>("outline");

  const contextValue = useMemo(
    () => ({ shapeMode, setShapeMode }),
    [shapeMode]
  );

  return (
    <ShapeModeContext.Provider value={contextValue}>
      {children}
    </ShapeModeContext.Provider>
  );
};

export { ShapeModeContext };
