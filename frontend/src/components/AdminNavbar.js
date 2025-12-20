import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.ok) navigate("/");
    } catch (error) {}
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-extrabold text-xl tracking-tight">
          Admin Portal
        </span>
        <Link to="/admin" className="hover:underline font-medium">
          Dashboard
        </Link>
        <Link to="/admin?tab=berita" className="hover:underline font-medium">
          Berita
        </Link>
        <Link to="/admin?tab=dosen" className="hover:underline font-medium">
          Dosen
        </Link>
        <Link to="/admin?tab=carousel" className="hover:underline font-medium">
          Carousel
        </Link>
        <Link to="/admin?tab=profil" className="hover:underline font-medium">
          Profil Prodi
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all">
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
