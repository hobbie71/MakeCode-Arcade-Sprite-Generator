// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";
import LoadingOverlay from "../../components/LoadingOverlay";

const InputSection = () => {
  return (
    <>
      <section className="sidebar-content w-full h-full text-center lg:text-left">
        <h1 className="heading-3 text-center">
          ArcadeMake Code Sprite Generator
        </h1>
        <AssetOptionsSelection />
        <PaletteSelection />
        <GenerationMethodSection />
      </section>
      <LoadingOverlay />
    </>
  );
};

export default InputSection;
