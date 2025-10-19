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
      className={`flex justify-between border rounded-lg px-3 py-2 my-4 w-full transition-colors text-text-default-300 shadow-default-lg ${
        isGenerating
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-default-300 cursor-pointer hover:bg-default-400"
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
