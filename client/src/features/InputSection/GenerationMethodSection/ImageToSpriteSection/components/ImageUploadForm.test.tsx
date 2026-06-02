import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../../test/test-utils";
import ImageUploadForm from "./ImageUploadForm";

const getDropZone = () => screen.getByRole("button", { name: "Upload image file" });
const getFileInput = () =>
  document.getElementById("image-upload-input") as HTMLInputElement;

describe("ImageUploadForm", () => {
  test("renders the drop-zone instructions and a hidden file input", () => {
    renderWithProviders(<ImageUploadForm />);
    expect(screen.getByText("Drag and Drop an Image Here")).toBeTruthy();
    expect(screen.getByText("Click to Browse Files")).toBeTruthy();
    const input = getFileInput();
    expect(input).toBeTruthy();
    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/*");
  });

  test("the drop zone is focusable and starts not-invalid", () => {
    renderWithProviders(<ImageUploadForm />);
    const zone = getDropZone();
    expect(zone.getAttribute("tabindex")).toBe("0");
    expect(zone.getAttribute("aria-invalid")).toBe("false");
  });

  test("selecting a non-image file shows the validation error", () => {
    renderWithProviders(<ImageUploadForm />);
    const input = getFileInput();
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Please upload a valid image file.");
    // aria-invalid flips to true and the alert is wired via aria-describedby.
    expect(getDropZone().getAttribute("aria-invalid")).toBe("true");
  });

  test("dropping a non-image file shows the validation error", () => {
    renderWithProviders(<ImageUploadForm />);
    const file = new File(["x"], "data.json", { type: "application/json" });
    fireEvent.drop(getDropZone(), { dataTransfer: { files: [file] } });
    expect(screen.getByRole("alert").textContent).toBe(
      "Please upload a valid image file.",
    );
  });

  test("dragOver activates the drop zone styling", () => {
    renderWithProviders(<ImageUploadForm />);
    const zone = getDropZone();
    fireEvent.dragOver(zone, { dataTransfer: { files: [] } });
    expect(zone.className).toContain("border-blue-400");
    fireEvent.dragLeave(zone, { dataTransfer: { files: [] } });
    expect(zone.className).not.toContain("border-blue-400");
  });

  test("a live status region exists for screen readers", () => {
    renderWithProviders(<ImageUploadForm />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
