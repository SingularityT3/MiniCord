import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./landing.tsx";
import { LoginPage, SignupPage } from "./auth.tsx";
import HomePage from "./home.tsx";
import "./index.css";
import axios from "axios";

const URL = "http://localhost:3000";
export const minicord = axios.create({
  baseURL: URL,
  timeout: 1000,
});

minicord.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
