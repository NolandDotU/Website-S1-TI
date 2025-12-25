import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toggle from "./components/Toggle";

// Pages
import HomePage from "./pages/Home";
import LecturerProfiles from "./pages/LecturerProfiles";
import Berita from "./pages/Berita";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/admin";
import { GoogleAuthError } from "./pages/middleware/googleAuth_error";
import { NoAccessPage } from "./pages/middleware/notHaveAccess";

// Middleware
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminNavbar";

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
  const noLayoutRoutes = [
    "/login",
    "/auth/google/error",
    "/no-access",
    "/admin",
  ];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      {/* Theme Toggle - always visible */}
      <div className="fixed top-4 right-4 z-50">
        <Toggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Navbar - conditional */}
      {shouldShowLayout && <Navbar />}

      {/* Main Content */}
      <main
        className={`flex-grow ${
          shouldShowLayout ? "px-4 md:px-8 lg:px-12" : ""
        } bg-white dark:bg-gray-900`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/profil-dosen" element={<LecturerProfiles />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/error" element={<GoogleAuthError />} />
          <Route path="/no-access" element={<NoAccessPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {/* Footer - conditional */}
      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;
