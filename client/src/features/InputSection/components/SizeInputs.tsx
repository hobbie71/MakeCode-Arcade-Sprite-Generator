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
    // Width × Height side by side, no per-input labels (a single "Size" label
    // sits above this group). Inputs flex to share the column and can shrink.
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        {fixedSize ? (
          <SizeInput type="width" fixedSize={fixedSize.x} />
        ) : (
          <SizeInput type="width" disabled={disabled} />
        )}
      </div>
      <span className="text-ink-subtle" aria-hidden="true">
        ×
      </span>
      <div className="min-w-0 flex-1">
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
