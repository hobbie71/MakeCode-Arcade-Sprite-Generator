import { useRef, useState } from "react";

import { useShakeOnError } from "../../../../../hooks/useShakeOnError";

interface Props {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  /** Bumped by the parent when Generate is clicked with an empty prompt → flashes
   *  the textarea red + shakes it. 0 = no failed attempt yet. */
  errorNonce?: number;
}

const AiPromptInput = ({ onSubmit, disabled = false, errorNonce = 0 }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [empty, setEmpty] = useState(true);

  // Persisted red border while the prompt is empty after a failed attempt; the
  // shake replays on each new attempt (errorNonce change).
  const hasError = errorNonce > 0 && empty;
  const shaking = useShakeOnError(errorNonce);

  const handleUserSubmit = (value: string | null = null) => {
    if (disabled) return;
    // Always commit the current value — including empty — so the parent's prompt
    // state can't go stale after the textarea is cleared.
    onSubmit((value ?? textareaRef.current?.value ?? "").trim());
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
    const value = e.target.value;
    setEmpty(value.trim() === "");
    // Commit on every change so the parent always holds the live prompt — fixes
    // the bug where typing then deleting left a stale value that bypassed the
    // empty-prompt guard on Generate.
    onSubmit(value.trim());
  };

  return (
    <div className={`mt-4 ${shaking ? "animate-shake" : ""}`}>
      <label htmlFor="ai-prompt-input" className="sr-only">
        AI Image Generation Prompt
      </label>
      <textarea
        ref={textareaRef}
        id="ai-prompt-input"
        className={`min-w-full min-h-24 mt-2 p-2 rounded-lg border bg-surface-raised text-ink shadow-xs placeholder:text-ink-subtle focus:outline-none ${
          hasError
            ? "border-danger ring-2 ring-danger-soft"
            : "border-line focus:border-accent"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        name="prompt"
        placeholder={
          disabled
            ? "Loading..."
            : 'Describe your sprite in detail. e.g. "a cheerful blue ninja with a dark hood and a raised steel katana, facing forward, bold black outline, retro 8-bit"'
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
