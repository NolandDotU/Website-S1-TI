import React, { useState, useRef, useEffect } from "react";
import Toggle from "../Toggle";
import { useAuth } from "../../context/Context";
import { env } from "../../services/utils/env";
import { User2 } from "lucide-react";

const AdminTopBar = ({ theme, toggleTheme }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const BEurl = env.BACKEND_URL || "http://localhost:5000";

  const photoUrl = user?.photo ? `${BEurl}${user.photo}` : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md py-2 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Content Management
      </h1>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 p-2 rounded-full
             hover:bg-gray-200 dark:hover:bg-gray-700
             transition-colors duration-200 cursor-pointer">
          <div
            className="flex items-center justify-start gap-x-3"
            onClick={() => setOpen(!open)}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600
                    flex items-center justify-center">
                <User2 className="h-4 w-4 text-gray-500 dark:text-gray-300" />
              </div>
            )}

            <span className="text-gray-900 dark:text-white font-medium">
              {user?.username || "Admin"}
            </span>
          </div>

          <Toggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {open && (
          <div className="absolute rounded-lg bg-gray-600 dark:bg-gray-700 shadow-md translate-y-2 right-0 w-44">
            <div className="flex flex-col items-center justify-center w-full">
              <a
                href="/"
                className="text-sm text-white hover:bg-gray-600 w-full text-center p-2">
                Main Page
              </a>
              <a
                href="/user/profile"
                className="text-sm text-white hover:bg-gray-600 w-full text-center p-2">
                <p className="text-sm text-white">Pengaturan Akun</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopBar;
