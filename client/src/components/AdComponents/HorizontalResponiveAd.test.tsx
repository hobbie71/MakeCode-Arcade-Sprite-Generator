import { test, expect, describe, beforeEach } from "bun:test";
import { renderWithProviders } from "../../test/test-utils";
import HorizontalResponiveAd from "./HorizontalResponiveAd";

describe("HorizontalResponiveAd", () => {
  beforeEach(() => {
    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = [];
  });

  test("mounts an adsbygoogle ins element without throwing", () => {
    const { container } = renderWithProviders(<HorizontalResponiveAd />);
    const ins = container.querySelector("ins");
    expect(ins).toBeTruthy();
    expect(ins!.getAttribute("class")).toContain("adsbygoogle");
  });

  test("pushes an ad request on mount and marks the slot loaded", () => {
    const { container } = renderWithProviders(<HorizontalResponiveAd />);
    const ads = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle;
    expect(ads.length).toBeGreaterThanOrEqual(1);
    const ins = container.querySelector("ins");
    expect(ins!.getAttribute("data-ad-loaded")).toBe("true");
  });
});
