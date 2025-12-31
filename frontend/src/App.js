import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Home";
import LecturerProfiles from "./pages/LecturerProfiles";
import Berita from "./pages/Berita";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/admin";
import { GoogleAuthError } from "./pages/middleware/googleAuth_error";
import { NoAccessPage } from "./pages/middleware/notHaveAccess";

import AdminLayout from "./components/Admin/AdminLayout";
import LecturerManagement from "./pages/admin/modulLecturer/listLecture";
import ListAnnouncement from "./pages/admin/modulAnnouncement/listAnnouncemenet";

function App() {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const location = useLocation();

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Routes yang ga perlu navbar/footer
  const noLayoutRoutes = ["/login", "/auth/google/error", "/no-access"];
  const isAdminRoute = location.pathname.startsWith("/admin");

  const shouldShowLayout =
    !noLayoutRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {shouldShowLayout && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <main
        className={`flex-grow ${
          shouldShowLayout ? "px-4 md:px-8 lg:px-12" : ""
        } bg-white dark:bg-gray-900`}>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/profil-dosen" element={<LecturerProfiles />} />

          {/* ========== AUTH ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/error" element={<GoogleAuthError />} />
          <Route path="/no-access" element={<NoAccessPage />} />

          {/* ========== PROTECTED ADMIN ROUTES ========== */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="berita/*" element={<ListAnnouncement />} />
            <Route path="dosen" element={<LecturerManagement />} />
          </Route>
        </Routes>
      </main>

      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;
