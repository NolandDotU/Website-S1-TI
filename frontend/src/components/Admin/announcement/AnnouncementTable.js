import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, View } from "lucide-react";
import PreviewAnnouncement from "../../../pages/admin/modulAnnouncement/previewAnnoucement";

const AnnouncementTable = ({
  announcements,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                NO
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                TITLE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                CREATED AT
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data pengumuman
                </td>
              </tr>
            ) : (
              announcements.map((announcement, index) => (
                <tr
                  key={announcement.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {announcement.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {announcement.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        announcement.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : announcement.status === "draft"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(announcement.createdAt).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/30 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete({ id: announcement.id });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 
                          dark:hover:bg-red-900/30 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 
                          dark:hover:bg-yellow-900/30 rounded-lg transition"
                        onClick={() =>
                          navigate(`/admin/berita/${announcement.id}`)
                        }>
                        <View className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                disabled:cursor-not-allowed transition">
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                disabled:cursor-not-allowed transition">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTable;
