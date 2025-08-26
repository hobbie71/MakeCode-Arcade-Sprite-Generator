import { useEffect, useRef } from "react";

// Type imports
import { Coordinates } from "@/types/pixel";

// Component imports
import SizeInput from "./SizeInput";

// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

interface Props {
  fixedSize?: Coordinates;
}

const SizeInputs = ({ fixedSize }: Props) => {
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
    <div className="input-size-container flex flex-row">
      <div className="mr-3">
        <p className="paragraph">Width</p>
        {fixedSize ? (
          <SizeInput type="width" fixedSize={fixedSize.x} />
        ) : (
          <SizeInput type="width" />
        )}
      </div>
      <div className="">
        <p className="paragraph">Height</p>
        {fixedSize ? (
          <SizeInput type="height" fixedSize={fixedSize.y} />
        ) : (
          <SizeInput type="height" />
        )}
      </div>
    </div>
  );
};

export default SizeInputs;
