import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// NOTE: tailwind.gen.css (incl. Tailwind preflight) is imported BEFORE base.css
// on purpose, so base.css's element styles + tokens win over preflight. :root
// custom properties resolve regardless of order.
import "./tailwind.gen.css";
import "./base.css";
// Fabric MDL2 icon font (the .ms-Icon glyphs in the editor tool rail), self-hosted
// instead of the office-ui-fabric-core CDN. Bundled from the single public/ copy
// (also used by the Remotion videos via staticFile); Bun resolves the @font-face
// url() to fabricmdl2icons.woff. Imported as a module so it works identically in
// dev and prod — a plain <link> in index.html breaks under Bun's dev server.
import "../public/fabric-icons.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
