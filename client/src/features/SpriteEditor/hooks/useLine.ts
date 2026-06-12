import { useShapeTool } from "./useShapeTool";
import { getLineCoordinates } from "../libs/getShapeCoordinates";

export const useLine = () =>
  useShapeTool({
    previewKey: "drawLinePreview",
    getOutlineCoordinates: getLineCoordinates,
  });
