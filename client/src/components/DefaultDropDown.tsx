import React, { useRef, useId } from "react";

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
  const selectRef = useRef<HTMLSelectElement>(null);
  const labelId = useId();
  const selectId = useId();
  const descriptionId = useId();
  const typeAheadBuffer = useRef("");
  const typeAheadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;
    onChange(Number(event.target.value));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    if (disabled) return;

    const currentIndex = value;
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        // Move to next option
        event.preventDefault();
        newIndex = Math.min(currentIndex + 1, options.length - 1);
        if (newIndex !== currentIndex) {
          onChange(newIndex);
        }
        break;

      case "ArrowUp":
        // Move to previous option
        event.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        if (newIndex !== currentIndex) {
          onChange(newIndex);
        }
        break;
      case "Enter":
      case " ":
        // Native select handles this, but we ensure it's not prevented
        break;

      default:
        // Type-ahead search functionality
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey
        ) {
          event.preventDefault();
          handleTypeAhead(event.key);
        }
        break;
    }
  };

  const handleTypeAhead = (char: string) => {
    // Clear previous timeout
    if (typeAheadTimeout.current) {
      clearTimeout(typeAheadTimeout.current);
    }

    // Add character to buffer
    typeAheadBuffer.current += char.toLowerCase();

    // Find matching option
    const searchStr = typeAheadBuffer.current;
    const matchIndex = options.findIndex((option) =>
      option.name.toLowerCase().startsWith(searchStr)
    );

    if (matchIndex !== -1 && matchIndex !== value) {
      onChange(matchIndex);
    }

    // Clear buffer after 500ms of no typing
    typeAheadTimeout.current = setTimeout(() => {
      typeAheadBuffer.current = "";
    }, 500);
  };

  const handleFocus = () => {
    // Ensure the select is properly focused for keyboard navigation
    if (selectRef.current && !disabled) {
      selectRef.current.focus();
    }
  };

  return (
    <div className="input-group">
      <label className="form-label" htmlFor={selectId} id={labelId}>
        {children}
      </label>
      <select
        ref={selectRef}
        id={selectId}
        className={`form-select ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : ""
        } ${className}`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        aria-disabled={disabled}
        aria-required={false}
        role="combobox"
        aria-expanded="false"
        aria-haspopup="listbox">
        {options.map((option, index) => (
          <option
            key={option.name}
            value={index}
            aria-selected={index === value}>
            {option.name}
          </option>
        ))}
      </select>
      {/* Hidden description for screen readers */}
      <span id={descriptionId} className="sr-only">
        Use arrow keys to navigate options. Press Enter or Space to select. Type
        to search.
      </span>
    </div>
  );
};

export default DefaultDropDown;
