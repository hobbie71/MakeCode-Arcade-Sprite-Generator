import { createRefContext } from "../createStateContext";

const { Context: CanvasContext, Provider: CanvasProvider } =
  createRefContext<HTMLCanvasElement>();

export { CanvasContext, CanvasProvider };
