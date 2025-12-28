import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../services/authAPI";
import { AdminNavbar } from "./AdminNavbar";
import AdminTopBar from "./AdminTopBar";

const AdminLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="flex min-h-screen font-dmsans bg-gray-100 dark:bg-gray-800 w-full">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Admin Content */}
      <section className="flex flex-col w-full">
        <AdminTopBar theme={theme} toggleTheme={toggleTheme} />
        <main className=" px-4 py-10 w-full">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
