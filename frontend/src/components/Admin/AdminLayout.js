import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../services/authAPI";
import { AdminNavbar } from "./AdminNavbar";

const AdminLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Navbar */}
      <AdminNavbar theme={theme} toggleTheme={toggleTheme} />

      {/* Admin Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
