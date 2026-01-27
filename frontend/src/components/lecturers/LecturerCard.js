import React, { useState, useEffect } from "react";
import { X, Mail, Link2, User, Award } from "lucide-react";
import { env } from "../../services/utils/env";
import { getLinkPreview } from "link-preview-js";

const getLink = async (link) => {
  try {
    console.log("LINK :", link);
    const shorter = await getLinkPreview(link || "", {
      imagesPropertyType: "og",
    });
    console.log("SHORTER LINK :", shorter);
    return shorter.url || shorter.favicons?.[0] || link;
  } catch (error) {
    console.error("Error getting link preview:", error);
    return link;
  }
};

const LecturerCard = ({ lecturer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortLink, setShortLink] = useState("");

  const defaultPhoto =
    "http://localhost:3845/assets/b54b1a4408966511b4cec9353d765b04c33f2fcb.png";

  const imagePath = env.BACKEND_URL + lecturer.photo;
  console.log("image path", imagePath);
  const expertise = Array.isArray(lecturer.expertise) ? lecturer.expertise : [];

  // Fetch short link when component mounts if external link exists
  useEffect(() => {
    if (lecturer.externalLink) {
      getLink(lecturer.externalLink).then(setShortLink);
    }
  }, [lecturer.externalLink]);

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center justify-start p-4 rounded-lg shadow-lg max-h-64 bg-white dark:bg-gray-800 transition-all w-fit max-w-[26rem] mx-auto cursor-pointer hover:shadow-xl hover:scale-[1.02]">
        <div className="flex items-center justify-center gap-4 w-full mb-6">
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

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-2">
              {lecturer.fullname || "No Name"}
            </h3>
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

            {lecturer.externalLink && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <Link2 className="w-4 h-4" />
                <span className="truncate">
                  {shortLink || lecturer.externalLink}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider uppercase mb-3">
            Keahlian
          </h4>

          <div className="grid grid-cols-4 gap-2">
            {expertise.length > 0 ? (
              expertise.slice(0, 4).map((item, i) => {
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detail Dosen
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-500 shadow-lg">
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

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {lecturer.fullname || "No Name"}
                    </h3>
                    {lecturer.username && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">@{lecturer.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <a
                        href={`mailto:${lecturer.email}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {lecturer.email || "dosen.ti@uksw.edu"}
                      </a>
                    </div>

                    {/* External Link */}
                    {lecturer.externalLink && (
                      <div className="flex items-center gap-3 max-w-96">
                        <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <a
                          onClick={() =>
                            window.open(shortLink || lecturer.externalLink)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                          {shortLink || lecturer.externalLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expertise Section */}
              <div className="space-y-4">
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
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    Tidak ada data keahlian
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
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
