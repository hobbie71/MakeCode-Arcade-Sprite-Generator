import { useId, useRef } from "react";

interface Props {
  children: string;
  onChange: (bool: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const CheckBox = ({ children, onChange, checked, disabled = false }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const inputId = useId();
  const descriptionId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Don't allow change if disabled
    if (disabled) return;

    const newValue = e.target.checked;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case " ":
      case "Enter":
        // Prevent default to avoid double-toggling (browser handles space automatically)
        // Toggle the checkbox
        e.preventDefault();
        onChange(!checked);
        break;
      default:
        break;
    }
  };

  const handleSpanClick = () => {
    // Allow clicking on the visual toggle to focus and toggle the input
    if (disabled && !inputRef.current) return;

    onChange(!checked);
  };

  const handleSpanKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    // Make the visual span keyboard accessible
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className="form-group flex flex-row justify-between items-center my-2">
      <label
        id={labelId}
        className={`form-label cursor-pointer`}
        htmlFor={inputId}>
        {children}
      </label>
      <div className="relative inline-block w-10 h-6">
        <input
          ref={inputRef}
          tabIndex={-1}
          type="checkbox"
          id={inputId}
          name={children}
          checked={checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          aria-checked={checked}
          aria-disabled={disabled}
          role="switch"
          title={
            disabled ? "This input is disabled during generation" : undefined
          }
          className="sr-only"
        />
        {/* Background Oval */}
        <span
          onClick={handleSpanClick}
          onKeyDown={handleSpanKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="presentation"
          aria-hidden="true"
          className={`
            absolute top-0 left-0 right-0 bottom-0
            rounded-full transition-colors duration-300 ease-in-out p-1
            ${
              checked
                ? "bg-primary-600"
                : "bg-default-300"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "shadow-default-lg cursor-pointer"}`}>
          {/* White circle */}
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-default-light-300 rounded-full 
              transition-transform duration-300 ease-in-out shadow-sm
              ${checked ? "transform translate-x-4" : ""}
            `}
          />
        </span>
        {/* Hidden description for screen readers */}
        <span id={descriptionId} className="sr-only">
          {disabled
            ? "This toggle is disabled during generation"
            : `Press Space or Enter to toggle. Current state: ${checked ? "On" : "Off"}`}
        </span>
      </div>
    </div>
  );
};

export default CheckBox;
