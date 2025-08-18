import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { EditorTools } from "@/types/tools";

type ToolSelectedType = {
  tool: EditorTools;
  setTool: Dispatch<SetStateAction<EditorTools>>;
  strokeSize: number;
  setStrokeSize: Dispatch<SetStateAction<number>>;
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
  const [strokeSize, setStrokeSize] = useState<number>(1);

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
