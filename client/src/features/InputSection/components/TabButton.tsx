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
      className={`tab-button ${isSelected ? "active" : ""}`}
      onClick={handleClick}
      disabled={disabled}>
      {children}
    </Button>
  );
};

// border-[#058b9b]

export default TabButton;
