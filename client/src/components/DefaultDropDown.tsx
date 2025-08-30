import React from "react";

// Generic type for dropdown options that have a name and value property
type DropdownOption<T> = {
  name: string;
} & T;

interface DefaultDropDownProps<T> {
  options: DropdownOption<T>[];
  value: number;
  onChange: (index: number) => void;
  children: string;
  className?: string;
  disabled?: boolean;
}

const DefaultDropDown = <T,>({
  options,
  value,
  onChange,
  children,
  className = "",
  disabled = false,
}: DefaultDropDownProps<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;
    onChange(Number(event.target.value));
  };

  return (
    <div className="input-group">
      <label className="form-label" htmlFor={children}>
        {children}
      </label>
      <select
        id={children}
        className={`form-select ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
            : ""
        } ${className}`}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label={children}
        aria-describedby={`${children}-description`}>
        {options.map((option, index) => (
          <option key={option.name} value={index}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DefaultDropDown;
