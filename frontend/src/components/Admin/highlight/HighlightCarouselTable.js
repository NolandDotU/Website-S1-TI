// ==================== HighlightCarouselTable.jsx ====================
import React from "react";
import { Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import { env } from "../../../services/utils/env";
import { data } from "react-router-dom";

const HighlightCarouselTable = ({
  items,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  console.log("items", items);
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
                TYPE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                PHOTO
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                JUDUL
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                URUTAN
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                STATUS
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
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data carousel
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const img =
                  env.BACKEND_URL +
                  (item.type === "custom"
                    ? item.customContent.imageUrl
                    : `/${item.announcementId.photo}`);
                console.log("img", img);
                const title =
                  item.type === "custom"
                    ? item.customContent.title
                    : item.announcementId.title;

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`px-2 text-center py-1 rounded-full uppercase text-sm font-medium text-white
                                    ${
                                      item.type === "announcement"
                                        ? "bg-blue-500"
                                        : ""
                                    }
                                    ${
                                      item.type === "costum"
                                        ? "bg-green-500"
                                        : ""
                                    }
                                  `}>
                        {item.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={img}
                        alt={title}
                        className="w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        #{item.order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.type === "costum" && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/30 rounded-lg transition">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 
                          dark:hover:bg-red-900/30 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

export default HighlightCarouselTable;
