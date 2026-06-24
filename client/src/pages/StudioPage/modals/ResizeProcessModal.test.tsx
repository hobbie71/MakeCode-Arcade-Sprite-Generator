import { describe, it, expect } from "bun:test";
import { useEffect, useState } from "react";

import {
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from "../../../test/test-utils";
import { RightDockProvider } from "../../../context/RightDockContext/RightDockContext";
import { useAssetType } from "../../../context/AssetTypeContext/useAssetType";
import { AssetType } from "../../../types/export";
import ResizeProcessModal from "./ResizeProcessModal";

// Mirror the real AI flow: the asset type is chosen up front, THEN the modal
// opens — so the once-per-open seed runs with the type already in context.
function Harness({ asset }: { asset: AssetType | null }) {
  const { setSelectedAsset } = useAssetType();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setSelectedAsset(asset);
    setOpen(true);
  }, [asset, setSelectedAsset]);
  return <ResizeProcessModal isOpen={open} onClose={() => setOpen(false)} />;
}

const renderModal = (asset: AssetType | null) =>
  renderWithProviders(
    <RightDockProvider>
      <Harness asset={asset} />
    </RightDockProvider>
  );

describe("ResizeProcessModal — asset-type presets", () => {
  it("Background: seeds and locks dimensions to 160×120", async () => {
    renderModal(AssetType.Background);
    const width = (await screen.findByLabelText("Width")) as HTMLInputElement;
    const height = screen.getByLabelText("Height") as HTMLInputElement;

    await waitFor(() => expect(width.value).toBe("160"));
    expect(height.value).toBe("120");
    expect(width.disabled).toBe(true);
    expect(height.disabled).toBe(true);
    expect(screen.getByText(/Locked to 160×120/)).toBeTruthy();
  });

  it("Tile: seeds 16×16, offers a 16/8 toggle, locks the inputs", async () => {
    renderModal(AssetType.Tile);
    const width = (await screen.findByLabelText("Width")) as HTMLInputElement;

    await waitFor(() => expect(width.value).toBe("16"));
    expect(width.disabled).toBe(true);
    expect(screen.getByRole("button", { name: "16×16" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "8×8" })).toBeTruthy();
  });

  it("Sprite: seeds 64×64 with free (editable) dimensions", async () => {
    renderModal(AssetType.Sprite);
    const width = (await screen.findByLabelText("Width")) as HTMLInputElement;

    await waitFor(() => expect(width.value).toBe("64"));
    expect(width.disabled).toBe(false);
  });

  it("clicking a modal tab applies that type's preset", async () => {
    // Open with no type (e.g. an upload) → free dimensions, nothing locked.
    renderModal(null);
    const width = (await screen.findByLabelText("Width")) as HTMLInputElement;
    expect(width.disabled).toBe(false);

    // Pick Background in the modal → applies the preset + locks to 160×120.
    fireEvent.click(screen.getByRole("radio", { name: "Background" }));

    await waitFor(() => expect(width.value).toBe("160"));
    expect(width.disabled).toBe(true);
    expect(screen.getByText(/Locked to 160×120/)).toBeTruthy();
  });
});
