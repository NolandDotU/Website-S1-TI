import React from "react";
import { env } from "../../services/utils/env";

const LecturerCard = ({ lecturer }) => {
  // Figma asset fallback
  const defaultPhoto =
    "http://localhost:3845/assets/b54b1a4408966511b4cec9353d765b04c33f2fcb.png";

  // Image path
  const imagePath = env.BACKEND_URL + lecturer.photo;

  // Prepare expertise badges
  const expertise = Array.isArray(lecturer.expertise) ? lecturer.expertise : [];

  return (
    <div className="flex flex-col items-center justify-start p-4 rounded-lg shadow-lg max-h-64 bg-white dark:bg-gray-800 transition-colors max-w-md mx-auto">
      {/* Photo & Info Section */}
      <div className="flex items-center justify-center gap-4 w-full mb-6">
        {/* Profile Image */}
        <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-md">
          <img
            src={imagePath || defaultPhoto}
            alt={lecturer.fullname || "Lecturer"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultPhoto;
            }}
          />
        </div>

        {/* Email & Name */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Email */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600 dark:text-blue-400 flex-shrink-0">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="truncate">
              {lecturer.email || "dosen.ti@uksw.edu"}
            </span>
          </div>

          {/* Fullname */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-2">
            {lecturer.fullname || "No Name"}
          </h3>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="w-full">
        <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider uppercase mb-3">
          Keahlian
        </h4>

        <div className="grid grid-cols-4 gap-2">
          {expertise.length > 0 ? (
            expertise.slice(0, 8).map((item, i) => {
              const displayText =
                item && item.length > 12 ? item.slice(0, 12) + "…" : item;
              return (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 text-center font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors truncate"
                  title={item}>
                  {displayText}
                </div>
              );
            })
          ) : (
            <div className="col-span-4 bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 text-center font-medium">
              Tidak ada data keahlian
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerCard;
