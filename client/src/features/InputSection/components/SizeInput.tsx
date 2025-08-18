import { useEffect, useRef } from "react";

// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { useCanvasResize } from "@/hooks/useCanvasResize";

// Type imports
import { MAX_LENGTH, MIN_LENGTH } from "@/types/pixel";

interface Props {
  type: "width" | "height";
}

const SizeInput = ({ type }: Props) => {
  // Hooks
  const { width, height } = useCanvasSize();
  const { updateCanvasSize } = useCanvasResize();

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
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
    const input = inputRef.current;
    if (!input) return;

    if (type === "width") {
      updateCanvasSize(Number(input.value), height);
    } else {
      updateCanvasSize(width, Number(input.value));
    }
  };

  const incrementSize = (amount: number) => {
    const input = inputRef.current;
    if (!input) return;

    if (amount < 0) {
      // Decreasing
      if (Number(input.value) === MIN_LENGTH) return;
    } else {
      // Increasing
      if (Number(input.value) === MAX_LENGTH) return;
    }

    input.value = String(Number(input.value) + amount);
    handleUserSubmit();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    if (type === "width") {
      input.value = String(width);
    } else {
      input.value = String(height);
    }
  }, [type, width, height]);

  return (
    <input
      ref={inputRef}
      className="input-no-arrows px-3 py-2 min-w-24 text-center border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      type="number"
      maxLength={3}
      onInput={handleInput}
      onDoubleClick={() => inputRef.current?.select()}
      onKeyDown={handleKeyDown}
      onBlur={() => handleUserSubmit()}
      max={MAX_LENGTH}
      min={MIN_LENGTH}
    />
  );
};

export default SizeInput;
