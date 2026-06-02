import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../test/test-utils";
import { useEffect } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { useLoading } from "../context/LoadingContext/useLoading";

// Helper that starts generation on mount, via the shared provider, so the
// sibling <LoadingOverlay /> becomes visible.
const StartLoading = ({ message }: { message?: string }) => {
  const { startGeneration } = useLoading();
  useEffect(() => {
    startGeneration(message);
  }, [startGeneration, message]);
  return null;
};

describe("LoadingOverlay", () => {
  test("renders nothing while not generating", () => {
    const { container } = renderWithProviders(<LoadingOverlay />);
    expect(container.textContent).toBe("");
  });

  test("shows the default message when generating without a custom message", () => {
    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = [];
    renderWithProviders(
      <>
        <StartLoading />
        <LoadingOverlay />
      </>,
    );
    expect(screen.getByText("Generating sprite...")).toBeTruthy();
    expect(screen.getByText(/Please wait/)).toBeTruthy();
  });

  test("shows a custom generation message", () => {
    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = [];
    renderWithProviders(
      <>
        <StartLoading message="Cooking pixels" />
        <LoadingOverlay />
      </>,
    );
    expect(screen.getByText("Cooking pixels")).toBeTruthy();
  });
});
