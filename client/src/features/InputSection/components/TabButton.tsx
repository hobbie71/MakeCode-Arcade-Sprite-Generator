import Button from "../../../components/Button";

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
    <Button
      className={`tab-button ${isSelected ? "active" : ""} ${
        disabled ? "cursor-not-allowed text-text-default-muted" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </Button>
  );
};

// border-[#058b9b]

export default TabButton;
