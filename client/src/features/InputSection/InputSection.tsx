// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";
import X_Button from "../../components/X_Button";

interface Props {
  closeMobileSidebar: () => void;
}

const InputSection = ({ closeMobileSidebar }: Props) => {
  return (
    <div className="sidebar-content w-full min-h-full text-center border-r-[1px] border-solid border-white">
      {/* Close button for mobile sidebar */}
      <div className="flex justify-between sm:justify-center items-center p-4 border-b border-neutral-200">
        <h2 className="text-white text-lg font-semibold">Generate Sprite</h2>
        <X_Button onClick={closeMobileSidebar} className="sm:hidden" />
      </div>

      <AssetOptionsSelection />
      <PaletteSelection />
      <GenerationMethodSection />
    </div>
  );
};

export default InputSection;
