import { test, expect, describe } from "bun:test";
import { renderWithProviders } from "../../../test/test-utils";
import ImportPreview from "./ImportPreview";

describe("ImportPreview", () => {
  test("renders nothing when there is no imported image", () => {
    const { container } = renderWithProviders(<ImportPreview />);
    // No imported image in the default provider state -> component returns null.
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.textContent).toBe("");
  });
});
