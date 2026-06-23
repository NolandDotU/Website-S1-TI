import React, { useState } from "react";
import { X, Mail, Link2, User, Award } from "lucide-react";
import { env } from "../../services/utils/env";

const LecturerCard = ({ lecturer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultPhoto =
    "http://localhost:3845/assets/b54b1a4408966511b4cec9353d765b04c33f2fcb.png";

  const imagePath = env.IMAGE_BASE_URL + lecturer.photo;
  const expertise = Array.isArray(lecturer.expertise) ? lecturer.expertise : [];

  // Tampilkan domain singkat dari URL
  const getDisplayLink = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center justify-start p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all w-full cursor-pointer hover:shadow-xl hover:scale-[1.02]">
        <div className="flex items-center justify-center gap-4 w-full mb-4">
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-md">
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

          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight line-clamp-2">
              {lecturer.fullname || "No Name"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg
                width="14"
                height="14"
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
              <span className="truncate text-xs sm:text-sm">
                {lecturer.email || "dosen.ti@uksw.edu"}
              </span>
            </div>

            {lecturer.externalLink && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {getDisplayLink(lecturer.externalLink)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider uppercase mb-2">
            Keahlian
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {expertise.length > 0 ? (
              expertise.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-gray-600 rounded-full px-2.5 py-1 text-xs font-medium"
                  title={item}>
                  {item && item.length > 18 ? item.slice(0, 18) + "…" : item}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                Tidak ada data keahlian
              </span>
            )}
            {expertise.length > 3 && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full px-2.5 py-1 text-xs font-medium">
                +{expertise.length - 3} lagi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Detail Dosen
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Profile Section — stacks vertically on mobile */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-500 shadow-lg">
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

                <div className="flex-1 space-y-3 text-center sm:text-left w-full min-w-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {lecturer.fullname || "No Name"}
                    </h3>
                    {lecturer.username && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">@{lecturer.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Email */}
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <a
                        href={`mailto:${lecturer.email}`}
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                        {lecturer.email || "dosen.ti@uksw.edu"}
                      </a>
                    </div>

                    {/* External Link */}
                    {lecturer.externalLink && (
                      <div className="flex items-center justify-center sm:justify-start gap-3 min-w-0">
                        <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <a
                          href={lecturer.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                          {getDisplayLink(lecturer.externalLink)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expertise Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Keahlian
                  </h4>
                </div>

                {expertise.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((item, i) => (
                      <div
                        key={i}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                    Tidak ada data keahlian
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LecturerCard;
