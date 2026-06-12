import { useContext } from "react";
import { ToolSelectedContext } from "./ToolSelectedContext";

export const useToolSelected = () => {
  const context = useContext(ToolSelectedContext);
  if (!context)
    throw new Error("useToolSelected must be inside <ToolSelectedProvider>");
  const { value: tool, setValue: setTool } = context;
  return { tool, setTool };
};
