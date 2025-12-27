import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ftiLogo from "../../assets/logoFTI-CNN7ms1i.png";
import { logout } from "../../services/authAPI";

export const AdminNavbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log("Logout response:", response);
      if (response.success) navigate("/");
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
    { logo: "", path: "/admin/dashboard", label: "Dashboard" },
    { logo: "", path: "/admin/berita", label: "Berita", fastBtn: "" },
    { logo: "", path: "/admin/dosen", label: "Dosen", fastBtn: "" },
    { logo: "", path: "/admin/carousel", label: "Highlight", fastBtn: "" },
    { logo: "", path: "/admin/profil", label: "Profil Prodi" },
  ];
  return (
    <div className="w-full bg-white shadow-md py-4 m-4 flex flex-box justify-start items-start ">
      <div className="flex items-center ml-4"></div>
      <img src={ftiLogo} alt="FTI Logo" className="h-10 w-10 mr-2" />
      <span className="text-xl font-bold text-gray-800 dark:text-white">
        Admin Panel
      </span>
      <nav className="ml-10 flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive(link.path)
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}>
            <div className="flex justify-start items-center p-2 rounded-lg">
              <div className="flex items-center justify-start">
                {link.logo && (
                  <img
                    src={link.logo}
                    alt={`${link.label} Logo`}
                    className="h-6 w-6 mr-2"
                  />
                )}
                <span>{link.label}</span>
              </div>
              {link.fastBtn && (
                <button
                  className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.fastBtn);
                  }}>
                  +
                </button>
              )}
            </div>
          </Link>
        ))}
      </nav>
      {
        <button
          className="ml-auto mr-4 text-gray-600 hover:text-blue-600"
          onClick={handleLogout}>
          Logout
        </button>
      }
    </div>
  );
};
