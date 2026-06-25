import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalProviders from "./providers/GlobalProviders";
import HeroPage from "./pages/HeroPage/HeroPage";
import StudioPage from "./pages/StudioPage/StudioPage";
import PrivacyPage from "./pages/PrivacyPage/PrivacyPage";
import LoadingOverlay from "./components/LoadingOverlay";
import Error from "./components/Error";
import { initAyet } from "./ads/ayet";

/**
 * Thin route shell. GlobalProviders holds state that must survive hero ↔ studio
 * navigation; the global overlays render OUTSIDE <Routes> so a loading spinner
 * or error toast persists across navigation.
 */
function App() {
  // Warm up the ayeT SDK once so the first generation's ad has the best chance
  // of being ready (no-ops if the async SDK script hasn't loaded yet).
  useEffect(() => {
    initAyet();
  }, []);

  return (
    <GlobalProviders>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoadingOverlay />
      <Error />
    </GlobalProviders>
  );
}

export default App;
