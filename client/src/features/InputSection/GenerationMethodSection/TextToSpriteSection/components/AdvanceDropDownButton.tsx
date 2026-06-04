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
      className={`flex justify-between border border-line rounded-lg px-3 py-2 my-4 w-full transition-colors text-ink shadow-xs bg-surface-raised cursor-pointer hover:bg-surface-hover ${
        isGenerating ? "opacity-50 cursor-not-allowed" : ""
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
