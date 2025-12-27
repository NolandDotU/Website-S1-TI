import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../services/authAPI";
import { AdminNavbar } from "./AdminNavbar";

const AdminLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="flex min-h-screen font-dmsans bg-gray-100 dark:bg-gray-800 w-full">
      {/* Admin Navbar */}
      <AdminNavbar theme={theme} toggleTheme={toggleTheme} />

      {/* Admin Content */}
      <section className="flex flex-col w-full">
        <main className=" px-4  w-full">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
