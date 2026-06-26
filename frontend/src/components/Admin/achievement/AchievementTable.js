import React, { useState, useEffect, useCallback } from "react";
import { Edit2, Trash2, Search, Award } from "lucide-react";
import { useToast } from "../../../context/toastProvider";
import { getAchievements, deleteAchievement } from "../../../services/api";
import ModalConfirmation from "../ModalConfirmation";
import Pagination from "../../Pagination";

const AchievementTable = ({ onEdit, refreshTrigger }) => {
  const toast = useToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAchievements(currentPage, limit, debouncedSearch);
      if (response && response.data) {
        setAchievements(response.data.achievements || []);
        setTotalPages(response.data.meta?.totalPage || 1);
        setTotalItems(response.data.meta?.total || 0);
      }
    } catch (error) {
      toast.error("Gagal memuat data prestasi");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, refreshTrigger]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAchievement(selectedId);
      toast.success("Prestasi berhasil dihapus");
      setDeleteModalOpen(false);
      fetchAchievements();
    } catch (error) {
      toast.error("Gagal menghapus prestasi");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari prestasi atau nama penerima..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Judul Prestasi
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Penerima
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategori
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tingkat
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p>Memuat data...</p>
                  </div>
                </td>
              </tr>
            ) : achievements.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Award className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Belum ada prestasi</p>
                    <p className="text-sm">Tidak ada data yang sesuai dengan pencarian</p>
                  </div>
                </td>
              </tr>
            ) : (
              achievements.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.recipient}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                      {item.level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.achievementDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id || item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {!loading && achievements.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ModalConfirmation
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Prestasi"
        message="Apakah Anda yakin ingin menghapus prestasi ini? Tindakan ini tidak dapat dibatalkan."
        type="danger"
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default AchievementTable;
