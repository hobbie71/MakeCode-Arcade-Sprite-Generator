import React from "react";

// Generic type for dropdown options that have a name and value property
type DropdownOption<T> = {
  name: string;
} & T;

interface DefaultDropDownProps<T> {
  options: DropdownOption<T>[];
  value: number;
  onChange: (index: number) => void;
  children?: React.ReactNode;
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
    <div className="flex flex-row">
      <select
        className={`border rounded px-2 py-1 mb-4 text-center ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
            : "text-black border-gray-400 hover:border-gray-500"
        } ${className}`}
        value={value}
        onChange={handleChange}
        disabled={disabled}>
        {options.map((option, index) => (
          <option key={option.name} value={index}>
            {option.name}
          </option>
        ))}
      </select>
      {children && <p className="paragraph ml-3">{children}</p>}
    </div>
  );
};

export default DefaultDropDown;
