import React from "react";
import { useNavigate } from "react-router-dom";
import { ArchiveIcon, Edit, Trash2, Upload, View } from "lucide-react";

const AnnouncementTable = ({
  announcements,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
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
                    {index + 1}
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
                      "id-ID",
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {announcement.status !== "published" && (
                        <button
                          onClick={() => onPublish(announcement)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="Publish">
                          <Upload className="w-4 h-4" />
                        </button>
                      )}

                      {announcement.status !== "archived" && (
                        <button
                          onClick={() => onArchive(announcement)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="Archive">
                          <ArchiveIcon className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete({ id: announcement.id });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 
                          dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 
                          dark:hover:bg-yellow-900/30 rounded-lg transition"
                        title="Preview"
                        onClick={() =>
                          navigate(`/cms/berita/${announcement.id}`)
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

      {/* Load More */}
      {page < totalPages && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button
            onClick={() => onPageChange(page + 1)}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium">
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTable;
