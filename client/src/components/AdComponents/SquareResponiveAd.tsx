import { useEffect } from "react";

// Const imports
import { GOOGLE_AD_CLIENT_ID, SQUARE_AD_SLOT_ID } from "../../constants/ads";

export const SquareResponiveAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("SquareResponiveAd error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block w-full h-full"
      data-ad-client={`ca-pub-${GOOGLE_AD_CLIENT_ID}`}
      data-ad-slot={SQUARE_AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default SquareResponiveAd;
