// Components imports
import GenerationMethodSection from "./GenerationMethodSection/GenerationMethodSection";
import AssetOptionsSelection from "./components/AssetOptionsSelection";
import PaletteSelection from "./components/PaletteSelection";

interface Props {
  closeMobileSidebar: () => void;
}

const InputSection = ({ closeMobileSidebar }: Props) => {
  return (
    <section className="sidebar-content w-full h-full text-center">
      {/* Close button for mobile sidebar */}
      <div className="flex justify-between sm:justify-center items-center p-4 border-b border-neutral-200">
        <h2 className="text-white text-lg font-semibold">Generate Sprite</h2>
        <button
          onClick={closeMobileSidebar}
          className="text-white hover:text-gray-300 transition-colors sm:hidden"
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

      <AssetOptionsSelection />
      <PaletteSelection />
      <GenerationMethodSection />
    </section>
  );
};

export default InputSection;
