import SegmentedControl from "../../../components/SegmentedControl";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { STROKE_SIZES, type StrokeSize } from "../../../types/pixel";

/** Real option: brush/stroke size (moved out of the old Sidebar StrokeIcons). */
export default function StrokeSizeOption() {
  const { strokeSize, setStrokeSize } = useStrokeSize();
  return (
    <SegmentedControl<StrokeSize>
      size="sm"
      label="Brush"
      ariaLabel="Brush size"
      value={strokeSize}
      onChange={setStrokeSize}
      options={STROKE_SIZES.map((size) => ({ value: size, label: `${size}px` }))}
    />
  );
}
