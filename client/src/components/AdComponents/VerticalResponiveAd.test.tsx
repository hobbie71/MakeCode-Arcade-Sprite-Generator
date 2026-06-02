import { test, expect, describe, beforeEach } from "bun:test";
import { renderWithProviders } from "../../test/test-utils";
import VerticalResponiveAd from "./VerticalResponiveAd";

describe("VerticalResponiveAd", () => {
  beforeEach(() => {
    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = [];
  });

  test("mounts an adsbygoogle ins element without throwing", () => {
    const { container } = renderWithProviders(<VerticalResponiveAd />);
    const ins = container.querySelector("ins");
    expect(ins).toBeTruthy();
    expect(ins!.getAttribute("class")).toContain("adsbygoogle");
  });

  test("pushes an ad request on mount", () => {
    renderWithProviders(<VerticalResponiveAd />);
    const ads = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle;
    expect(ads.length).toBeGreaterThanOrEqual(1);
  });
});
