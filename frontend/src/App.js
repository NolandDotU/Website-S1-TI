import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toggle from "./components/Toggle";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/Home";
import LecturerProfiles from "./pages/LecturerProfiles";
import Berita from "./pages/Berita";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/admin";
import { GoogleAuthError } from "./pages/middleware/googleAuth_error";
import { NoAccessPage } from "./pages/middleware/notHaveAccess";

// Admin Layout
import AdminLayout from "./components/Admin/AdminLayout";

function App() {
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  // Theme handler
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Routes yang ga perlu navbar/footer
  const noLayoutRoutes = ["/login", "/auth/google/error", "/no-access"];
  const isAdminRoute = location.pathname.startsWith("/admin");

  const shouldShowLayout =
    !noLayoutRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Theme Toggle - always visible */}
      <div className="fixed top-4 right-4 z-50">
        <Toggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Navbar - conditional (public pages only) */}
      {shouldShowLayout && <Navbar />}

      {/* Main Content */}
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
              <ProtectedRoute allowedRoles="admin">
                <AdminLayout theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
            {/* <Route path="users" element={<UsersPage />} /> */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Routes>
      </main>

      {/* Footer - conditional (public pages only) */}
      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;
