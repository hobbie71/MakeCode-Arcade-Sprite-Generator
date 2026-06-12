import { useEffect, useRef } from "react";

// Context imports
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { useCanvasResize } from "../../../hooks/useCanvasResize";

// Type imports
import { MAX_LENGTH, MIN_LENGTH } from "../../../types/pixel";

interface Props {
  type: "width" | "height";
  fixedSize?: number; // Should be between MIN_LENGTH and MAX_LENGTH
  disabled?: boolean;
}

const SizeInput = ({ type, fixedSize, disabled = false }: Props) => {
  // Hooks
  const { width, height } = useCanvasSize();
  const { updateCanvasSize } = useCanvasResize();

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // A fixed value or disabled state locks out all user interaction
  const isLocked = Boolean(fixedSize) || disabled;

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (isLocked) return;

    const input = e.currentTarget;
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    } else if (Number(input.value) > MAX_LENGTH) {
      input.value = MAX_LENGTH.toString();
    } else if (input.value.length < 1 || Number(input.value) === 0) {
      input.value = "1";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      handleUserSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      incrementSize(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      incrementSize(-1);
    } else if (e.key === "Backspace") {
      const input = inputRef.current;
      if (!input) return;
      if (input.value.length !== 1) return;

      e.preventDefault();
      input.select();
    }
  };

  const handleUserSubmit = () => {
    if (isLocked) return;

    const input = inputRef.current;
    if (!input) return;

    if (type === "width") {
      updateCanvasSize(Number(input.value), height);
    } else {
      updateCanvasSize(width, Number(input.value));
    }
  };

  const incrementSize = (amount: number) => {
    if (isLocked) return;

    const input = inputRef.current;
    if (!input) return;

    const value = Number(input.value);
    const limit = amount < 0 ? MIN_LENGTH : MAX_LENGTH;
    if (value === limit) return;

    input.value = String(value + amount);
    handleUserSubmit();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // If fixedSize is provided, use that value and don't respond to context changes
    if (fixedSize) {
      input.value = String(fixedSize);
      return;
    }

    if (type === "width") {
      input.value = String(width);
    } else {
      input.value = String(height);
    }
  }, [type, width, height, fixedSize]);

  return (
    <input
      ref={inputRef}
      className={`form-input input-no-arrows w-full px-3 py-2 text-left font-medium ${
        isLocked ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type="number"
      aria-label={type === "width" ? "Width" : "Height"}
      maxLength={3}
      onInput={handleInput}
      onDoubleClick={() => !isLocked && inputRef.current?.select()}
      onKeyDown={handleKeyDown}
      onBlur={() => handleUserSubmit()}
      max={MAX_LENGTH}
      min={MIN_LENGTH}
      disabled={fixedSize !== undefined || disabled}
      readOnly={fixedSize !== undefined || disabled}
      title={
        fixedSize
          ? "This value is fixed and cannot be changed"
          : disabled
            ? "This input is disabled during generation"
            : undefined
      }
      style={{
        userSelect: isLocked ? "none" : "auto",
      }}
    />
  );
};

export default SizeInput;
