import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// NOTE: tailwind.gen.css (incl. Tailwind preflight) is imported BEFORE base.css
// on purpose, so base.css's element styles + tokens win over preflight. :root
// custom properties resolve regardless of order.
import "./tailwind.gen.css";
import "./base.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
