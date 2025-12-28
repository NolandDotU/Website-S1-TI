import React from "react";
import Toggle from "../Toggle";
import { useAuth } from "../../context/Context";
import { env } from "../../services/utils/env";
import { User2 } from "lucide-react";

const AdminTopBar = ({ theme, toggleTheme }) => {
  const { user } = useAuth();
  const BEurl = env.BACKEND_URL || "http://localhost:5000";

  const photoUrl = user?.photo ? `${BEurl}${user.photo}` : null;

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md py-2 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Panel
      </h1>

      <div
        className="flex items-center gap-3 p-2 rounded-full
             hover:bg-gray-200 dark:hover:bg-gray-700
             transition-colors duration-200 cursor-pointer">
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
          {user?.name || "Admin"}
        </span>

        <Toggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default AdminTopBar;
