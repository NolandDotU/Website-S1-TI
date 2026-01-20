import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";
import AdminTopBar from "./AdminTopBar";

const AdminLayout = ({ theme, toggleTheme }) => {
  return (
    <div className="flex min-h-screen font-dmsans bg-gray-100 dark:bg-gray-800 overflow-x-hidden">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Admin Content */}
      <section className="flex flex-col flex-1 min-w-0">
        <AdminTopBar theme={theme} toggleTheme={toggleTheme} />
        <main className="px-4 py-10 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
