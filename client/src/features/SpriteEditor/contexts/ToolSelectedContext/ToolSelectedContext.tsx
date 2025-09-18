import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { EditorTools } from "../../../../types/tools";
import type { StrokeSize } from "../../../../types/pixel";

type ToolSelectedType = {
  tool: EditorTools;
  setTool: Dispatch<SetStateAction<EditorTools>>;
  strokeSize: StrokeSize;
  setStrokeSize: Dispatch<SetStateAction<StrokeSize>>;
};

const ToolSelectedContext = createContext<undefined | ToolSelectedType>(
  undefined
);

export const ToolSelectedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tool, setTool] = useState<EditorTools>(EditorTools.Pencil);
  const [strokeSize, setStrokeSize] = useState<StrokeSize>(1);

  const contextValue = useMemo(
    () => ({ tool, setTool, strokeSize, setStrokeSize }),
    [tool, strokeSize]
  );

  return (
    <ToolSelectedContext.Provider value={contextValue}>
      {children}
    </ToolSelectedContext.Provider>
  );
};

export { ToolSelectedContext };
