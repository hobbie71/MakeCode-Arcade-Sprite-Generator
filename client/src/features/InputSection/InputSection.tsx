// Components
import SizeInput from "./components/SizeInput";
import { H2, P } from "@/components/Typography";

const InputSection = () => {
  return (
    <div className="input-section-container p-2">
      <H2>Sprite Size (px)</H2>
      <div className="input-size-container flex flex-row">
        <div className="mr-3">
          <P>Width</P>
          <SizeInput type="width" />
        </div>
        <div className="">
          <P>Height</P>
          <SizeInput type="height" />
        </div>
      </div>
    </div>
  );
};

export default InputSection;
