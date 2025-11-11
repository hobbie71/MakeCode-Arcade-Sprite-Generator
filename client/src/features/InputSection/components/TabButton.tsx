import Button from "../../../components/Button";

interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}

const TabButton = ({
  isSelected,
  onClick,
  children,
  disabled = false,
  isLoading = false,
}: Props) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <Button
      className={`tab-button ${isSelected ? "active" : ""}`}
      onClick={handleClick}
      disabled={disabled || isLoading}>
      {children}
    </Button>
  );
};

export default TabButton;
