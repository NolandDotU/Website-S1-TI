import React from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../services/authAPI";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.ok) navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/berita", label: "Berita" },
    { path: "/admin/dosen", label: "Dosen" },
    { path: "/admin/carousel", label: "Carousel" },
    { path: "/admin/profil", label: "Profil Prodi" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md "></nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
