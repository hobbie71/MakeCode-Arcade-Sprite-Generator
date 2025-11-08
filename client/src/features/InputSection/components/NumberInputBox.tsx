import { useEffect, useRef } from "react";

// Type imports
import { MAX_LENGTH, MIN_LENGTH } from "../../../types/pixel";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  maxDigits?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const NumberInputBox = ({
  label,
  value,
  onChange,
  min = MIN_LENGTH,
  max = MAX_LENGTH,
  maxDigits = 3,
  disabled = false,
  placeholder,
  className = "",
}: Props) => {
  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Don't allow input if disabled
    if (disabled) return;

    const input = e.currentTarget;

    // Limit number of digits
    if (input.value.length > maxDigits) {
      input.value = input.value.slice(0, maxDigits);
    } else if (Number(input.value) > max) {
      input.value = max.toString();
    } else if (input.value.length < 1 || Number(input.value) < min) {
      if (input.value.length > 0) {
        input.value = min.toString();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Don't allow keyboard interaction if disabled
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      handleUserSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      incrementValue(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      incrementValue(-1);
    } else if (e.key === "Backspace") {
      const input = inputRef.current;
      if (!input) return;
      if (input.value.length !== 1) return;

      e.preventDefault();
      input.select();
    }
  };

  const handleUserSubmit = () => {
    // Don't allow submission if disabled
    if (disabled) return;

    const input = inputRef.current;
    if (!input) return;

    const newValue = Math.max(min, Math.min(max, Number(input.value) || min));
    onChange(newValue);
  };

  const incrementValue = (amount: number) => {
    // Don't allow increment if disabled
    if (disabled) return;

    const input = inputRef.current;
    if (!input) return;

    const currentValue = Number(input.value) || min;

    if (amount < 0) {
      // Decreasing
      if (currentValue === min) return;
    } else {
      // Increasing
      if (currentValue === max) return;
    }

    const newValue = Math.max(min, Math.min(max, currentValue + amount));
    input.value = String(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.value = String(value);
  }, [value]);

  return (
    <div className={`input-group align-middle ${className}`}>
      <label className="form-label mr-3" htmlFor={label}>
        {label}:
      </label>
      <input
        ref={inputRef}
        className={`form-input input-no-arrows min-w-4 text-center ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        type="number"
        id={label}
        name={label}
        maxLength={maxDigits}
        onInput={handleInput}
        onDoubleClick={() => !disabled && inputRef.current?.select()}
        onKeyDown={handleKeyDown}
        onBlur={handleUserSubmit}
        max={max}
        min={min}
        disabled={disabled}
        readOnly={disabled}
        placeholder={placeholder}
        aria-label={label}
        aria-describedby={
          disabled ? `${label}-disabled-hint` : `${label}-range-hint`
        }
        title={
          disabled ? "This value is disabled and cannot be changed" : undefined
        }
        style={{
          userSelect: disabled ? "none" : "auto",
        }}
      />
    </div>
  );
};

export default NumberInputBox;
