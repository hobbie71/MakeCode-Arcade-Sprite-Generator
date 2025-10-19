interface Props {
  isAdvanceTabOpen: boolean;
  setIsAdvanceTabOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating?: boolean;
}

const AdvanceDropDownButton = ({
  isAdvanceTabOpen,
  setIsAdvanceTabOpen,
  isGenerating,
}: Props) => {
  return (
    <button
      type="button"
      onClick={() => setIsAdvanceTabOpen((prev) => !prev)}
      className={`flex justify-around border rounded-lg px-3 py-2 my-4 w-full transition-colors ${
        isGenerating
          ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
          : "bg-gray-100 text-black border-gray-300 cursor-pointer hover:bg-gray-200"
      }`}
      aria-expanded={isAdvanceTabOpen}
      disabled={isGenerating}>
      Advanced Settings
      <span
        className={`ml-2 transition-transform inline-block ${
          isAdvanceTabOpen ? "" : "rotate-90"
        }`}>
        ▼
      </span>
    </button>
  );
};

export default AdvanceDropDownButton;
