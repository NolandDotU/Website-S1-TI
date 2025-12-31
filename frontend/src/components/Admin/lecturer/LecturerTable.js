// src/components/Admin/Lecturer/LecturerTable.jsx
import React, { useState } from "react";
import { Edit2, Trash2, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { env } from "../../../services/utils/env";

const LecturerTable = ({
  lecturers,
  loading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  // Skeleton Loading Component
  const SkeletonRow = ({ delay = 0 }) => (
    <tr className="border-b border-gray-100 dark:border-gray-700">
      <td className="px-6 py-4">
        <div
          className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"
              style={{ animationDelay: `${delay + 100}ms` }}
            />
            <div
              className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"
              style={{ animationDelay: `${delay + 200}ms` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
          <div
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"
            style={{ animationDelay: `${delay + 100}ms` }}
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          <div
            className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
          <div
            className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            style={{ animationDelay: `${delay + 100}ms` }}
          />
          <div
            className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            style={{ animationDelay: `${delay + 200}ms` }}
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
          <div
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            style={{ animationDelay: `${delay + 100}ms` }}
          />
        </div>
      </td>
    </tr>
  );

  // Avatar Component with error handling
  const LecturerAvatar = ({ lecturer }) => {
    const [imageError, setImageError] = useState(false);

    // Fallback avatar dengan initial
    const FallbackAvatar = () => (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-base ring-2 ring-blue-200 dark:ring-blue-800">
        {lecturer.fullname?.charAt(0).toUpperCase() || "?"}
      </div>
    );

    // Jika tidak ada photo atau ada error, tampilkan fallback
    if (!lecturer.photo || imageError) {
      return <FallbackAvatar />;
    }

    const photoURL = env.BACKEND_URL + lecturer.photo;
    console.log("Loading photo from URL:", photoURL);

    return (
      <img
        src={photoURL}
        alt={lecturer.fullname}
        onError={() => setImageError(true)}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  NAMA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  EXPERTISE
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <SkeletonRow key={index} delay={index * 100} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (lecturers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Mail className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tidak ada data dosen
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada dosen yang ditambahkan atau hasil pencarian tidak
            ditemukan.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                NO
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                NAMA
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                EXPERTISE
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {lecturers.map((lecturer, index) => (
              <motion.tr
                key={lecturer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {/* NO */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {(page - 1) * 10 + index + 1}
                </td>

                {/* NAMA dengan Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <LecturerAvatar lecturer={lecturer} />

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {lecturer.fullname || lecturer.name || "Unnamed"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {lecturer.position || "Dosen"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{lecturer.email || "-"}</span>
                  </div>
                </td>

                {/* EXPERTISE */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5 max-w-md">
                    {lecturer.expertise && lecturer.expertise.length > 0 ? (
                      <>
                        {lecturer.expertise.slice(0, 3).map((exp, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium 
                              bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                              rounded-md border border-blue-200 dark:border-blue-800">
                            {exp}
                          </span>
                        ))}
                        {lecturer.expertise.length > 3 && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium 
                              bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                              rounded-md border border-gray-300 dark:border-gray-600">
                            +{lecturer.expertise.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                        Tidak ada keahlian
                      </span>
                    )}
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(lecturer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                        dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-110"
                      title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lecturer)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 
                        dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110"
                      title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Halaman{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {page}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {totalPages}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerTable;
