// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";
import LoadingOverlay from "../../components/LoadingOverlay";

interface Props {
  closeMobileSidebar: () => void;
}

const InputSection = ({ closeMobileSidebar }: Props) => {
  return (
    <>
      <section className="sidebar-content w-full h-full text-center lg:text-left">
        {/* Close button for mobile sidebar */}
        <div className="sm:hidden flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-white text-lg font-semibold">Generate Sprite</h2>
          <button
            onClick={closeMobileSidebar}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close sidebar">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h1 className="heading-3 text-center hidden sm:block">
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
