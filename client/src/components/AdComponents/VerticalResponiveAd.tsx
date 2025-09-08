import { useEffect } from "react";

// Const imports
import { GOOGLE_AD_CLIENT_ID, VERTICAL_AD_SLOT_ID } from "../../constants/ads";

export const VerticalResponiveAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("VerticalResponiveAd error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block w-full h-full"
      data-ad-client={`ca-pub-${GOOGLE_AD_CLIENT_ID}`}
      data-ad-slot={VERTICAL_AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default VerticalResponiveAd;
