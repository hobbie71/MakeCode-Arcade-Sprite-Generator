import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../../test/test-utils";
import AiPromptInput from "./AiPromptInput";

const getTextarea = () =>
  screen.getByLabelText("AI Prompt for sprite generation") as HTMLTextAreaElement;

describe("AiPromptInput", () => {
  test("renders the label and an editable textarea", () => {
    renderWithProviders(<AiPromptInput onSubmit={mock()} />);
    expect(screen.getByText("AI Image Generation Prompt")).toBeTruthy();
    const textarea = getTextarea();
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea.disabled).toBe(false);
    expect(textarea.placeholder).toBe("Create a scary dragon that spits fire!");
  });

  test("submits the trimmed value on blur", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} />);
    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: "  a red knight  " } });
    fireEvent.blur(textarea);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toBe("a red knight");
  });

  test("Enter without shift submits and prevents a newline", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} />);
    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: "dragon" } });
    onSubmit.mockClear();
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toBe("dragon");
  });

  test("Shift+Enter does NOT submit (allows newline)", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} />);
    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: "dragon" } });
    onSubmit.mockClear();
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("Tab submits the current (trimmed) value", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} />);
    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: " goblin " } });
    onSubmit.mockClear();
    fireEvent.keyDown(textarea, { key: "Tab" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toBe("goblin");
  });

  test("the textarea is wired up for screen readers", () => {
    renderWithProviders(<AiPromptInput onSubmit={mock()} />);
    const textarea = getTextarea();
    expect(textarea.getAttribute("aria-describedby")).toBe("ai-prompt-description");
    expect(textarea.name).toBe("prompt");
  });

  test("a whitespace-only value on blur does not submit", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} />);
    const textarea = getTextarea();
    fireEvent.change(textarea, { target: { value: "   " } });
    onSubmit.mockClear();
    fireEvent.blur(textarea);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("disabled blocks submission and shows the loading placeholder", () => {
    const onSubmit = mock();
    renderWithProviders(<AiPromptInput onSubmit={onSubmit} disabled />);
    const textarea = getTextarea();
    expect(textarea.disabled).toBe(true);
    expect(textarea.placeholder).toBe("Loading...");
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    fireEvent.blur(textarea);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
