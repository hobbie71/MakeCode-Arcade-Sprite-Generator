import { describe, it, expect } from "bun:test";

import { render, screen, fireEvent } from "../../../../../test/test-utils";
import AiPromptInput from "./AiPromptInput";

describe("AiPromptInput", () => {
  it("commits the live value on every change, including empty", () => {
    // Regression: typing then deleting used to leave a stale non-empty value in
    // the parent, which let an empty prompt bypass the Generate guard.
    const calls: string[] = [];
    render(<AiPromptInput onSubmit={(p) => calls.push(p)} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "a blue ninja" } });
    expect(calls.at(-1)).toBe("a blue ninja");

    fireEvent.change(textarea, { target: { value: "" } });
    expect(calls.at(-1)).toBe("");
  });
});
