import { Routes, Route, Navigate } from "react-router-dom";
import GlobalProviders from "./providers/GlobalProviders";
import HeroPage from "./pages/HeroPage/HeroPage";
import StudioPage from "./pages/StudioPage/StudioPage";
import LoadingOverlay from "./components/LoadingOverlay";
import Error from "./components/Error";

/**
 * Thin route shell. GlobalProviders holds state that must survive hero ↔ studio
 * navigation; the global overlays render OUTSIDE <Routes> so a loading spinner
 * or error toast persists across navigation.
 */
function App() {
  return (
    <GlobalProviders>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoadingOverlay />
      <Error />
    </GlobalProviders>
  );
}

export default App;
