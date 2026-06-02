import {
  test,
  expect,
  describe,
  mock,
  beforeEach,
  afterEach,
} from "bun:test";

// Guard the prismjs side-effect imports: the CSS theme + python grammar are
// not needed (and not reliable) under happy-dom, so stub them. highlightElement
// is replaced with a recording mock so we can assert CodeDisplay calls it.
const highlightElement = mock(() => {});
mock.module("prismjs", () => ({ default: { highlightElement } }));
mock.module("prismjs/components/prism-python", () => ({}));
mock.module("prismjs/themes/prism.css", () => ({}));

import {
  renderWithProviders,
  screen,
  fireEvent,
  waitFor,
  act,
} from "../../../test/test-utils";
import CodeDisplay from "./CodeDisplay";

// handleCopy awaits navigator.clipboard.writeText, then calls setCopied async.
// Flush those microtasks inside act() so the follow-up state update is settled
// (and React's act warning stays quiet).
const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const CODE = "img`\n. . .\n`";

describe("CodeDisplay", () => {
  let writeText: ReturnType<typeof mock>;

  beforeEach(() => {
    highlightElement.mockClear();
    writeText = mock(async () => {});
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    // leave a benign clipboard behind for any later tests
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async () => {} },
      configurable: true,
    });
  });

  test("renders the passed code text", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    expect(screen.getByRole("button").textContent).toBe(CODE);
  });

  test("exposes the clickable region as a button", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    const region = screen.getByRole("button");
    expect(region).toBeTruthy();
    expect((region as HTMLElement).tagName).toBe("PRE");
  });

  test("defaults to the javascript language class and aria-label", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    const region = screen.getByRole("button");
    expect(region.getAttribute("aria-label")).toBe(
      "Copy javascript code to clipboard",
    );
    expect(region.querySelector("code")?.className).toContain(
      "language-javascript",
    );
  });

  test("honors the codingLanguage prop", () => {
    renderWithProviders(
      <CodeDisplay codingLanguage="python">{CODE}</CodeDisplay>,
    );
    const region = screen.getByRole("button");
    expect(region.getAttribute("aria-label")).toBe(
      "Copy python code to clipboard",
    );
    expect(region.querySelector("code")?.className).toContain(
      "language-python",
    );
  });

  test("runs Prism.highlightElement after render", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    expect(highlightElement).toHaveBeenCalled();
  });

  test("clicking copies the code to the clipboard", async () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    fireEvent.click(screen.getByRole("button"));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toBe(CODE);
    await flush();
  });

  test("pressing Enter copies the code to the clipboard", async () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toBe(CODE);
    await flush();
  });

  test("pressing Space copies the code to the clipboard", async () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(writeText).toHaveBeenCalledTimes(1);
    await flush();
  });

  test("an unrelated key does not copy", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "a" });
    expect(writeText).not.toHaveBeenCalled();
  });

  test("shows a 'Click to copy' tooltip on mouse enter", () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    expect(screen.queryByText("Click to copy")).toBeNull();
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.getByText("Click to copy")).toBeTruthy();
    fireEvent.mouseLeave(screen.getByRole("button"));
    expect(screen.queryByText("Click to copy")).toBeNull();
  });

  test("shows a 'Copied!' confirmation after a successful copy", async () => {
    renderWithProviders(<CodeDisplay>{CODE}</CodeDisplay>);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeTruthy();
    });
  });
});
