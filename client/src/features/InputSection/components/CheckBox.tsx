interface Props {
  children: string;
  onChange: (bool: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const CheckBox = ({ children, onChange, checked, disabled = false }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Don't allow change if disabled
    if (disabled) return;

    const newValue = e.target.checked;
    onChange(newValue);
  };

  return (
    <div className="flex flex-row px-2 py-1">
      <label
        className={`paragraph ${disabled ? "text-gray-500 cursor-not-allowed" : "cursor-pointer"}`}
        htmlFor={children}>
        <input
          type="checkbox"
          className={`mr-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          id={children}
          name={children}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          title={
            disabled ? "This input is disabled during generation" : undefined
          }
          style={{
            userSelect: disabled ? "none" : "auto",
          }}
        />
        {children}
      </label>
    </div>
  );
};

export default CheckBox;
