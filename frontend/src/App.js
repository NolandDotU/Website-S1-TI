import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Home";
import LecturerProfiles from "./pages/LecturerProfiles";
import Berita from "./pages/Berita";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/admin";
import { NoAccessPage } from "./pages/middleware/notHaveAccess";
import AdminLayout from "./components/Admin/AdminLayout";
import LecturerManagement from "./pages/admin/modulLecturer/listLecture";
import ListAnnouncement from "./pages/admin/modulAnnouncement/listAnnouncemenet";
import PreviewAnnouncement from "./pages/admin/modulAnnouncement/previewAnnoucement";
import HighlightManage from "./pages/admin/modulHighlight/highlightManage";
import TentangTISection from "./components/TentangTISection";
import AccountSettings from "./pages/AccountSettings";
import TentangProdi from "./pages/TentangProdi";
import History from "./pages/admin/History";
import { UserManagement } from "./pages/admin/modulUser/ListUsers";
import Settings from "./pages/admin/modulSettings/Settings";
import TentangProdiManage from "./pages/admin/modulTentangProdi/TentangProdiManage";
import ListPartners from "./pages/admin/modulPartners/listPartners";
import KnowledgeManagement from "./pages/admin/modulKnowledge/listKnowledge";
import DashboardDosen from "./pages/dosen/dashboard.dosen";

import { ChatModal } from "./components/chatbot/ChatModal";
import { FloatingChatButton } from "./components/chatbot/FloatingChatButton";
import Maintenance from "./pages/Maintenance";
import { getSettings } from "./services/api";

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

  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isCheckingMaintenance, setIsCheckingMaintenance] = useState(true);

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings?.isMaintenance) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error("Failed to fetch system settings:", error);
      } finally {
        setIsCheckingMaintenance(false);
      }
    };
    checkSettings();
  }, []);

  // Routes yang ga perlu navbar/footer
  const noLayoutRoutes = ["/login", "/no-access"];
  const isAdminRoute = location.pathname.startsWith("/cms");

  const shouldShowLayout =
    !noLayoutRoutes.includes(location.pathname) && !isAdminRoute;

  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isCheckingMaintenance) {
    return <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  // If maintenance is active, and we are not in admin or login route
  if (isMaintenance && !isAdminRoute && location.pathname !== "/login") {
    return <Maintenance />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {shouldShowLayout && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main
        className={`flex-grow ${shouldShowLayout ? "px-4 md:px-8 lg:px-12" : ""
          } bg-white dark:bg-gray-900`}>
        <FloatingChatButton
          onOpen={() => setIsChatOpen(true)}
          isOpen={isChatOpen}
          theme={theme}
        />

        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          theme={theme}
        />
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/profil-dosen" element={<LecturerProfiles />} />
          <Route path="/tentang-program-studi" element={<TentangProdi />} />

          <Route path="/user/profile" element={<AccountSettings />} />

          {/* ========== AUTH ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/no-access" element={<NoAccessPage />} />

          {/* ========== PROTECTED ADMIN & HMP ROUTES ========== */}
          <Route
            path="/cms/*"
            element={
              <ProtectedRoute requiredRole={["admin", "hmp"]}>
                <AdminLayout theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="highlight" element={<HighlightManage />} />
            <Route path="history" element={<History />} />
            <Route path="partners" element={<ListPartners />} />
            <Route path="knowledge" element={<KnowledgeManagement />} />
            <Route path="berita" element={<Outlet />}>
              <Route index element={<ListAnnouncement />} />
              <Route path=":id" element={<PreviewAnnouncement />} />
            </Route>

            {/* ========== PROTECTED ADMIN ONLY ROUTES ========== */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole={["admin"]}>
                  <Outlet />
                </ProtectedRoute>
              }>
              <Route path="users" element={<UserManagement />} />
              <Route path="dosen" element={<LecturerManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tentang-prodi" element={<TentangProdiManage />} />
            </Route>
          </Route>

          {/* ========== PROTECTEDDOSEN ONLY ROUTES ========== */}
          <Route
            path="/dosen"
            element={
              <ProtectedRoute requiredRole="dosen">
                <Outlet />
              </ProtectedRoute>
            }>
            <Route path="profile" element={<DashboardDosen />} />
          </Route>
        </Routes>
      </main>

      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;
