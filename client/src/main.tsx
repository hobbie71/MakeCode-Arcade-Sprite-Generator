import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.gen.css";
import "./base.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
