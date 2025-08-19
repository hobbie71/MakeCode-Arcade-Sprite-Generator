import { useEffect } from "react";

// Type imports
import { Coordinates } from "@/types/pixel";

// Component imports
import SizeInput from "./SizeInput";

// Hook imports
import { useCanvasResize } from "@/hooks/useCanvasResize";

interface Props {
  fixedSize?: Coordinates;
}

const SizeInputs = ({ fixedSize }: Props) => {
  const { updateCanvasSize } = useCanvasResize();

  useEffect(() => {
    if (fixedSize) {
      updateCanvasSize(fixedSize.x, fixedSize.y);
    }
  }, [fixedSize, updateCanvasSize]);

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
