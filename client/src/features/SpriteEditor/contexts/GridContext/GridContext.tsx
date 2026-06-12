import { createStateContext } from "../../../../context/createStateContext";

/** Whether the per-pixel grid overlay is drawn on the canvas. Default off. */
const { Context: GridContext, Provider: GridProvider } =
  createStateContext<boolean>(false);

export { GridContext, GridProvider };
