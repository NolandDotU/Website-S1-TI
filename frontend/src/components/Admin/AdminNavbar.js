import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Context";
import ftiLogo from "../../assets/logoFTI-CNN7ms1i.png";
import ModalConfirmation from "./ModalConfirmation";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Image,
  FileText,
  LogOut,
  Plus,
  ChevronRight,
  Menu,
  X,
  Settings,
  HistoryIcon,
} from "lucide-react";

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navLinks = [
    {
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      label: "Dashboard",
    },
    {
      icon: Newspaper,
      path: "/admin/berita",
      label: "Berita",
      action: "/admin/berita/create",
    },
    {
      icon: Users,
      path: "/admin/dosen",
      label: "Dosen",
      action: "/admin/dosen/create",
    },
    {
      icon: Image,
      path: "/admin/highlight",
      label: "Highlight",
      action: "/admin/carousel/create",
    },
    {
      icon: FileText,
      path: "/admin/profil",
      label: "Profil Prodi",
    },
    {
      icon: Settings,
      path: "/admin/settings",
      label: "Settings",
    },
    {
      icon: HistoryIcon,
      path: "/admin/history",
      label: "History",
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg text-gray-800 dark:text-white">
          {!isSidebarOpen && <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-xl 
          transition-all duration-300 z-40 flex flex-col
          ${isSidebarOpen ? "w-64" : "w-0 lg:w-20"} 
          ${isSidebarOpen ? "" : "overflow-hidden"}`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 
                flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <img
                  src={ftiLogo}
                  alt="FTI Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  S1 Teknik Informatika
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:flex ml-4 w-6 h-6 bg-white dark:bg-gray-800 
                  border-2 border-gray-200 dark:border-gray-700 rounded-full 
                  items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors shadow-md">
                <ChevronRight
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform
                    ${isSidebarOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}

          {!isSidebarOpen && (
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 
                flex items-center justify-center mx-auto cursor-pointer"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <img
                src={ftiLogo}
                alt="FTI Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 overflow-x-hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <div key={link.path} className="relative group">
                {/* Main Link */}
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                    }
                    ${!isSidebarOpen && "justify-center"}`}>
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />

                  {isSidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 truncate">
                        {link.label}
                      </span>
                      {active && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </Link>

                {/* Quick Action Button - Only when sidebar is open */}
                {link.action && isSidebarOpen && (
                  <button
                    onClick={() => navigate(link.action)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 
                      bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                      flex items-center justify-center opacity-0 group-hover:opacity-100 
                      transition-opacity shadow-md z-10"
                    title={`Add ${link.label}`}>
                    <Plus className="w-4 h-4" />
                  </button>
                )}

                {/* Tooltip - Only when sidebar is collapsed */}
                {!isSidebarOpen && (
                  <div
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2
                      px-3 py-2 bg-gray-900 dark:bg-gray-700 
                      text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                      pointer-events-none transition-opacity whitespace-nowrap z-50
                      before:content-[''] ">
                    {link.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative group">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl
                text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 
                transition-all font-medium
                ${!isSidebarOpen && "justify-center"}`}>
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
        {/* Logout Confirmation Modal */}
        <ModalConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLogout}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          type="warning"
          cancelText="Cancel"
          confirmText="Logout"
        />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Main content spacer */}
      <div
        className={`${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } transition-all duration-300`}
      />
    </>
  );
};
