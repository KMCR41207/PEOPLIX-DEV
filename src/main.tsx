import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DevelopersPage from "./features/developers/DevelopersPage";
import "./index.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/developers" element={<DevelopersPage />} />
        {/* Redirect root to /developers for standalone dev */}
        <Route path="*" element={<Navigate to="/developers" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
