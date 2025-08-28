import { useRef } from "react";

interface Props {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

const AiPromptInput = ({ onSubmit, disabled = false }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleUserSubmit = () => {
    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const prompt = textarea.value.trim();
    if (prompt) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    } else if (e.key === "Tab") {
      handleUserSubmit();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className={`mx-2 min-w-full min-h-10 p-2 rounded ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
          : "text-black bg-white border-gray-400 hover:border-gray-500"
      }`}
      name="prompt"
      placeholder={
        disabled ? "Loading..." : "Create a scary dragon that spits fire!"
      }
      onKeyDown={handleKeyDown}
      onBlur={handleUserSubmit}
      disabled={disabled}
      readOnly={disabled}></textarea>
  );
};

export default AiPromptInput;
