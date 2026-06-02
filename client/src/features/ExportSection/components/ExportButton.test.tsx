import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../test/test-utils";
import ExportButton from "./ExportButton";
import { ImageExportFormats } from "../../../types/export";

describe("ExportButton", () => {
  test("renders an uppercased 'Download as <FORMAT>' label", () => {
    renderWithProviders(
      <ExportButton format={ImageExportFormats.PNG} onClick={() => {}} />,
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.textContent).toBe("Download as PNG");
  });

  test("renders each image export format uppercased", () => {
    const { rerender } = renderWithProviders(
      <ExportButton format={ImageExportFormats.JPEG} onClick={() => {}} />,
    );
    expect(screen.getByRole("button").textContent).toBe("Download as JPEG");
    rerender(
      <ExportButton format={ImageExportFormats.WEBP} onClick={() => {}} />,
    );
    expect(screen.getByRole("button").textContent).toBe("Download as WEBP");
  });

  test("uses the primary button variant", () => {
    renderWithProviders(
      <ExportButton format={ImageExportFormats.PNG} onClick={() => {}} />,
    );
    expect(screen.getByRole("button").className).toContain("btn-primary");
  });

  test("invokes onClick exactly once when clicked", () => {
    const onClick = mock();
    renderWithProviders(
      <ExportButton format={ImageExportFormats.PNG} onClick={onClick} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
