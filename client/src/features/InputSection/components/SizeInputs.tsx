import { useEffect, useRef } from "react";

// Type imports
import type { Coordinates } from "../../../types/pixel";

// Component imports
import SizeInput from "./SizeInput";

// Context imports
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";

interface Props {
  fixedSize?: Coordinates;
  disabled?: boolean;
}

const SizeInputs = ({ fixedSize, disabled = false }: Props) => {
  const { setWidth, setHeight } = useCanvasSize();
  const previousFixedSizeRef = useRef<Coordinates | undefined>(undefined);

  useEffect(() => {
    // Only update if fixedSize has actually changed (deep comparison)
    if (!fixedSize) return;

    const hasChanged =
      !previousFixedSizeRef.current ||
      fixedSize.x !== previousFixedSizeRef.current.x ||
      fixedSize.y !== previousFixedSizeRef.current.y;

    if (hasChanged) {
      previousFixedSizeRef.current = { ...fixedSize };
      // Directly update canvas size without going through the sprite resize logic
      setWidth(fixedSize.x);
      setHeight(fixedSize.y);
    }
  }, [fixedSize, setWidth, setHeight]);

  return (
    <div className="form-group responsive-flex mb-0">
      <div className="form-group">
        <label className="form-label">Width</label>
        {fixedSize ? (
          <SizeInput type="width" fixedSize={fixedSize.x} />
        ) : (
          <SizeInput type="width" disabled={disabled} />
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Height</label>
        {fixedSize ? (
          <SizeInput type="height" fixedSize={fixedSize.y} />
        ) : (
          <SizeInput type="height" disabled={disabled} />
        )}
      </div>
    </div>
  );
};

export default SizeInputs;
