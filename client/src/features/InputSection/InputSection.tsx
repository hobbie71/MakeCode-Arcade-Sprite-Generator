// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";
import LoadingOverlay from "../../components/LoadingOverlay";

const InputSection = () => {
  return (
    <>
      <div className="p-2 w-full h-full" style={{ backgroundColor: "#1e1e1e" }}>
        <h1 className="heading-3">ArcadeMake Code Sprite Generator</h1>

        <AssetOptionsSelection />
        <PaletteSelection />
        <GenerationMethodSection />
      </div>
      <LoadingOverlay />
    </>
  );
};

export default InputSection;
