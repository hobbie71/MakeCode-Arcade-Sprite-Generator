import SegmentedControl from "../../../components/SegmentedControl";
import { useShapeMode } from "../contexts/ShapeModeContext/useShapeMode";
import type { ShapeMode } from "../contexts/ShapeModeContext/ShapeModeContext";

/**
 * Shape fill vs. outline for Rectangle/Circle. Wired to ShapeModeContext, which
 * the rectangle/circle tools (and their previews) read to draw filled vs. outline
 * shapes.
 */
export default function ShapeModeOption() {
  const { shapeMode, setShapeMode } = useShapeMode();
  return (
    <SegmentedControl<ShapeMode>
      size="sm"
      label="Shape"
      ariaLabel="Shape mode"
      value={shapeMode}
      onChange={setShapeMode}
      options={[
        { value: "outline", label: "Outline" },
        { value: "fill", label: "Fill" },
      ]}
    />
  );
}
