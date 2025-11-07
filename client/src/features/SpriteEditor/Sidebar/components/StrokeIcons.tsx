// Component imports
import StrokeIcon from "./StrokeIcon";

// Type imports
import { STROKE_SIZES } from "../../../../types/pixel";

const StrokeIcons = () => {
  return (
    <>
      {STROKE_SIZES.map((size, i) => (
        <StrokeIcon key={i} strokeSize={size} />
      ))}
    </>
  );
};

export default StrokeIcons;
