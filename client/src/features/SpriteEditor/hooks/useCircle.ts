import { useShapeTool } from "./useShapeTool";
import {
  getCircleCoordinates,
  getFilledCircleCoordinates,
} from "../libs/getShapeCoordinates";

export const useCircle = () =>
  useShapeTool({
    previewKey: "drawCirclePreview",
    getOutlineCoordinates: getCircleCoordinates,
    getFilledCoordinates: getFilledCircleCoordinates,
  });
