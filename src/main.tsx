import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./pages/landing/landing.tsx";
import { LoginPage, SignupPage } from "./pages/auth/auth.tsx";
import HomePage from "./pages/home/home.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);
