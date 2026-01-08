import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo-DMl9ckBx.png";
import { useAuth } from "../context/Context";
import { env } from "../services/utils/env";
import Toggle from "./Toggle";
import { User2 } from "lucide-react";

const Navbar = ({ theme, toggleTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropDownUser, setIsDropDownUser] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const timeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);
  const user = useAuth().user;
  const { logout } = useAuth();

  const BEurl = env.BACKEND_URL || "http://localhost:5000";

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1000);
  };

  const handleUserMouseEnter = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
    }
    setIsDropDownUser(true);
  };

  const handleUserMouseLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setIsDropDownUser(false);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    setIsDropDownUser(false);
  };

  const getAvatarSrc = () => {
    if (!user.photo || imgError) {
      return <User2 />;
    }
    return `${BEurl}${user.photo}`;
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (userTimeoutRef.current) {
        clearTimeout(userTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full text-black dark:text-white bg-white dark:bg-gray-900">
      <div className="max-w-full mx-auto px-10 pt-2">
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-20">
            <Link to="/" className="text-2xl font-bold hover:text-gray-300">
              <img src={Logo} alt="Logo" className="h-14" />
            </Link>
            <ul className="flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 items-center space-x-6 border-2 border-gray-300 dark:border-gray-700 p-2 rounded-xl">
              <li>
                <Link
                  to="/"
                  className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/berita"
                  className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                  Berita
                </Link>
              </li>
              <li
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <button className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center gap-1">
                  Lainnya
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <Link
                      to="/profil-dosen"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Daftar Profil Dosen
                    </Link>
                    <Link
                      to="/tentang-program-studi"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Tentang Program Studi
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <div className="p-2">
              <Toggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            {user ? (
              <div
                className="relative"
                ref={userDropdownRef}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  {imgError ? (
                    <User2 />
                  ) : (
                    <img
                      src={getAvatarSrc()}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                        setImgError(true);
                      }}
                    />
                  )}
                </button>
                {isDropDownUser && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    {/* <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold">
                        {user.name || user.username}
                      </p>
                      {user.emaill && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      Profile
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-600 dark:text-red-400">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
