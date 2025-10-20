// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";
import X_Button from "../../components/X_Button";

// Context imports
import { useAssetType } from "../../context/AssetTypeContext/useAssetType";

interface Props {
  closeMobileSidebar: () => void;
}

const InputSection = ({ closeMobileSidebar }: Props) => {
  const { selectedAsset } = useAssetType();

  return (
    <div className="w-full min-h-full text-cente p-4 bg-default-200 rounded-3xl shadow-default-lg">
      {/* Close button for mobile sidebar */}
      <div className="flex justify-between items-center pb-6 pt-2 sm:justify-center">
        <h2 className="text-white text-lg font-semibold">
          Generate {selectedAsset}
        </h2>
        <X_Button onClick={closeMobileSidebar} className="sm:hidden" />
      </div>

      <AssetOptionsSelection />
      <PaletteSelection />
      <GenerationMethodSection />
    </div>
  );
};

export default InputSection;
