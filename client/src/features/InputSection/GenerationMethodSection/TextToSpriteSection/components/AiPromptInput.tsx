import { useRef } from "react";

interface Props {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

const AiPromptInput = ({ onSubmit, disabled = false }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleUserSubmit = (prompt: string | null = null) => {
    if (disabled) return;

    if (prompt) {
      onSubmit(prompt);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    prompt = textarea.value.trim();

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = e.target.value;

    if (prompt === "") handleUserSubmit(prompt);
  };

  return (
    <div className="mt-4">
      <label htmlFor="ai-prompt-input" className="text-neutral-200">
        AI Image Generation Prompt
      </label>
      <textarea
        ref={textareaRef}
        id="ai-prompt-input"
        className={`min-w-full min-h-24 mt-2 p-2 rounded-lg bg-default-300 text-text-default-300 shadow-default-lg placeholder-text-default-muted ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
            : ""
        }`}
        name="prompt"
        placeholder={
          disabled ? "Loading..." : "Create a scary dragon that spits fire!"
        }
        onKeyDown={handleKeyDown}
        onBlur={() => handleUserSubmit()}
        onChange={handleChange}
        disabled={disabled}
        readOnly={disabled}
        aria-describedby="ai-prompt-description"
        aria-label="AI Prompt for sprite generation"></textarea>
    </div>
  );
};

export default AiPromptInput;
