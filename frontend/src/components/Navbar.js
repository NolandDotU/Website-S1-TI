import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo/Logo-DMl9ckBx.png";
import { useAuth } from "../context/Context";
import { env } from "../services/utils/env";
import Toggle from "./Toggle";
import { Menu, User2, X, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { getSettings } from "../services/settings.service";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = ({ theme, toggleTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropDownUser, setIsDropDownUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const timeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);
  const user = useAuth().user;
  const { logout } = useAuth();

  const BEurl = env.IMAGE_BASE_URL || "http://localhost:5000";

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
    setIsMobileMenuOpen(false);
  };

  const getAvatarSrc = () => {
    if (!user.photo || imgError) {
      return <User2 />;
    }
    return `${BEurl}${user.photo}`;
  };

  useEffect(() => {
    getSettings().then((res) => {
      if (res && res.data) {
        setSettings(res.data);
      }
    }).catch(console.error);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (userTimeoutRef.current) {
        clearTimeout(userTimeoutRef.current);
      }
    };
  }, []);

  useGSAP(() => {
    // Navbar slide down on load
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: navRef });

  const handleLogoHover = () => {
    gsap.to(logoRef.current, { rotation: "+=360", duration: 1, ease: "back.out(1.5)" });
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full text-black dark:text-white bg-white dark:bg-gray-900 shadow-sm flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-blue-700 dark:bg-gray-950 text-white py-2 px-4 md:px-10 hidden lg:flex justify-between items-center text-sm font-medium">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{settings?.prodiPhone || "(0298) 321212"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{settings?.prodiEmail || "fti@uksw.edu"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <a href={settings?.prodiMapsLink || "#"} target="_blank" rel="noreferrer" className="truncate max-w-[200px] md:max-w-xs hover:underline cursor-pointer">
              {settings?.prodiAddress || "Gedung Fakultas Teknologi Informasi..."}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {settings?.socialFacebook && settings.socialFacebook !== "#" && settings.socialFacebook !== "" && (
            <a href={settings.socialFacebook} title="Facebook" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {settings?.socialInstagram && settings.socialInstagram !== "#" && settings.socialInstagram !== "" && (
            <a href={settings.socialInstagram} title="Instagram" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {settings?.socialYoutube && settings.socialYoutube !== "#" && settings.socialYoutube !== "" && (
            <a href={settings.socialYoutube} title="Youtube" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
              <Youtube className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 md:px-10 pt-2 pb-2 w-full">
        <div className="flex h-16 items-center justify-between gap-3 md:gap-8">
          <div className="flex items-center gap-4 md:gap-20">
            <Link
              to="/"
              className="text-2xl font-bold hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
              onMouseEnter={handleLogoHover}>
              <img ref={logoRef} src={Logo} alt="Logo" className="h-14" />
            </Link>
            <ul className="hidden md:flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 items-center space-x-6 border-2 border-gray-300 dark:border-gray-700 p-2 rounded-xl">
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
              <li>
                <Link
                  to="/pengumuman"
                  className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                  Pengumuman
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
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
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
          <div className="flex items-center gap-1 md:gap-2">
            <div className="p-2">
              <Toggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            {user ? (
              <div
                className="relative"
                ref={userDropdownRef}
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
                onClick={() => setIsDropDownUser(!isDropDownUser)}>
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
                    {(user.role === "admin" || user.role === "hmp") && (
                      <Link to="/cms/dashboard">
                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          Dashboard
                        </button>
                      </Link>
                    )}
                    {user.role === "dosen" && (
                      <Link to="/dosen/profile">
                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          Public Profile
                        </button>
                      </Link>
                    )}
                    <Link to="/user/profile">
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        Pengaturan Akun
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm dark:hover:bg-gray-700 transition text-red-600 dark:text-red-400">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-block py-2 px-4 rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white transition">
                Login
              </Link>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              onClick={() =>
                setIsMobileMenuOpen((prev) => {
                  const next = !prev;
                  if (!next) setIsMobileMoreOpen(false);
                  return next;
                })
              }
              aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-2 space-y-1">
              <Link
                to="/"
                className="block py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link
                to="/berita"
                className="block py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}>
                Berita
              </Link>
              <Link
                to="/pengumuman"
                className="block py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}>
                Pengumuman
              </Link>

              <button
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center justify-between"
                onClick={() => setIsMobileMoreOpen((prev) => !prev)}>
                Lainnya
                <svg
                  className={`w-4 h-4 transition-transform ${isMobileMoreOpen ? "rotate-180" : ""}`}
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

              {isMobileMoreOpen && (
                <div className="ml-3 mr-1 my-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                  <Link
                    to="/profil-dosen"
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Daftar Profil Dosen
                  </Link>
                  <Link
                    to="/tentang-program-studi"
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Tentang Program Studi
                  </Link>
                </div>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="block py-2 px-3 rounded border border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
