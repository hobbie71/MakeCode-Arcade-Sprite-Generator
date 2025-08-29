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
      className={`tab-button ${isSelected ? "active" : ""} ${
        disabled ? "cursor-not-allowed text-white/30" : ""
      }`}
      type="button"
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

// border-[#058b9b]

export default TabButton;
