import { EditorTools } from "../../../../types/tools";
import { createStateContext } from "../../../../context/createStateContext";

const { Context: ToolSelectedContext, Provider: ToolSelectedProvider } =
  createStateContext<EditorTools>(EditorTools.Pencil);

export { ToolSelectedContext, ToolSelectedProvider };
