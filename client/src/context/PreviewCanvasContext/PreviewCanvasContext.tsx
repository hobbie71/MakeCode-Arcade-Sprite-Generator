import { createRefContext } from "../createStateContext";

const { Context: PreviewCanvasContext, Provider: PreviewCanvasProvider } =
  createRefContext<HTMLCanvasElement>();

export { PreviewCanvasContext, PreviewCanvasProvider };
