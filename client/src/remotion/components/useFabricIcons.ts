import { continueRender, delayRender, staticFile } from "remotion";
import { useEffect, useState } from "react";

// Loads the Office Fabric (MDL2) icon font that MakeCode Arcade uses. The font is
// vendored into client/public/ (fabric-icons.css + fabricmdl2icons.woff) and pulled
// in via delayRender so a headless render deterministically waits for it; in the live
// <Player> it just briefly holds the loading state until the font is ready.
//
// Call this once at the top of any composition that renders <MsIcon>.
let injected = false;

export const useFabricIcons = () => {
  const [handle] = useState(() => delayRender("Loading Fabric MDL2 icons"));

  useEffect(() => {
    let cancelled = false;
    const release = () => {
      if (!cancelled) continueRender(handle);
    };

    const load = async () => {
      try {
        if (!injected) {
          await new Promise<void>((resolve, reject) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = staticFile("fabric-icons.css");
            link.onload = () => resolve();
            link.onerror = () => reject(new Error("fabric css failed to load"));
            document.head.appendChild(link);
          });
          injected = true;
        }
        // The @font-face is now registered — load the single family explicitly.
        await document.fonts.load("16px 'FabricMDL2Icons'");
        await document.fonts.ready;
      } catch {
        /* release anyway so the render never hangs */
      }
      release();
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);
};
