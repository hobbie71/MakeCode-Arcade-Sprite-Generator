import { useEffect, useRef } from "react";
import {
  GOOGLE_AD_CLIENT_ID,
  HORIZONTAL_AD_SLOT_ID,
} from "../../constants/ads";

export const HorizontalResponiveAd = () => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adRef.current) {
      try {
        // Only push if the ins element is empty
        if (!adRef.current.getAttribute("data-ad-loaded")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adRef.current.setAttribute("data-ad-loaded", "true");
        }
      } catch (e) {
        console.error("HorizontalResponiveAd error:", e);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle block w-full h-full"
      data-ad-client={`ca-pub-${GOOGLE_AD_CLIENT_ID}`}
      data-ad-slot={HORIZONTAL_AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default HorizontalResponiveAd;
