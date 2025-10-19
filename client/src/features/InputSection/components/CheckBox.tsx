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
    <div className="form-group flex flex-row justify-between items-center my-2">
      <label
        className={`form-label ${disabled ? "text-text-default-muted cursor-not-allowed" : "cursor-pointer"}`}
        htmlFor={children}>
        {children}
      </label>
      <label className="relative inline-block w-10 h-6">
        <input
          type="checkbox"
          id={children}
          name={children}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={children}
          aria-describedby={disabled ? `${children}-disabled-hint` : undefined}
          title={
            disabled ? "This input is disabled during generation" : undefined
          }
          className="sr-only"
        />
        <span
          className={`
            absolute cursor-pointer top-0 left-0 right-0 bottom-0 shadow-default-lg
            rounded-full transition-colors duration-300 ease-in-out p-1
            ${
              checked
                ? disabled
                  ? "bg-default-300"
                  : "bg-primary-600"
                : disabled
                  ? "bg-default-300"
                  : "bg-default-300"
            }
            ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          `}>
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-default-light-300 rounded-full 
              transition-transform duration-300 ease-in-out
              ${checked ? "transform translate-x-4" : ""}
            `}
          />
        </span>
      </label>
    </div>
  );
};

export default CheckBox;
