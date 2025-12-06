import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo-DMl9ckBx.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full text-black dark:text-white bg-white dark:bg-gray-900">
      <div className="max-w-full mx-auto px-10 pt-2">
        <div className="flex h-16 items-center justify-start  gap-20">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300">
            <img src={Logo} alt="Logo" className="h-14" />
          </Link>

          <ul className="flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 items-center space-x-6 border-2 border-gray-300 dark:border-gray-700 p-2 rounded-xl">
            <li>
              <Link to="/" className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                Berita
              </Link>
            </li>
            <li 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="py-2 px-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center gap-1"
              >
                Lainnya
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/profil-dosen"
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Daftar Profil Dosen
                  </Link>
                  <Link
                    to="/admin"
                    className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition border-t border-gray-200 dark:border-gray-700"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
