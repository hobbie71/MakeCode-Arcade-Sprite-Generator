interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const TabButton = ({
  isSelected,
  onClick,
  children,
  disabled = false,
}: Props) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <button
      className={`
        px-2.5 py-1 text-sm bg-transparent transition-all duration-200 outline-none focus:outline-none
        ${disabled ? "cursor-not-allowed text-white/30" : "cursor-pointer"}
        ${
          isSelected
            ? "text-white border-b-2 border-b-white border-x-0 border-t-0 border-solid"
            : disabled
              ? "text-white/30 border-b-2 border-b-transparent border-x-0 border-t-0 border-solid"
              : "text-white/60 hover:text-white/80 border-b-2 border-b-transparent border-x-0 border-t-0 border-solid"
        }
      `}
      type="button"
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

// border-[#058b9b]

export default TabButton;
