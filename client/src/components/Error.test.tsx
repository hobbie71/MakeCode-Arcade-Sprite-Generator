import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent, act } from "../test/test-utils";
import { useEffect } from "react";
import Error from "./Error";
import { useError } from "../context/ErrorContext/useError";

// Helper that sets an error on mount via the shared provider, so the sibling
// <Error /> picks it up from context.
const SetError = ({ message }: { message: string | null }) => {
  const { setError } = useError();
  useEffect(() => {
    setError(message);
  }, [setError, message]);
  return null;
};

describe("Error", () => {
  test("renders nothing when there is no error", () => {
    const { container } = renderWithProviders(<Error />);
    expect(container.textContent).toBe("");
  });

  test("shows the error message when one is set", () => {
    renderWithProviders(
      <>
        <SetError message="Something broke" />
        <Error />
      </>,
    );
    expect(screen.getByText("Something broke")).toBeTruthy();
  });

  test("clicking the close button dismisses the error", () => {
    renderWithProviders(
      <>
        <SetError message="Dismiss me" />
        <Error />
      </>,
    );
    expect(screen.getByText("Dismiss me")).toBeTruthy();
    const closeButton = screen.getByRole("button");
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(screen.queryByText("Dismiss me")).toBeNull();
  });
});
