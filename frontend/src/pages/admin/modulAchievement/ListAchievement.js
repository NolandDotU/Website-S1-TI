import React, { useState } from "react";
import { Search, Plus, Filter, RefreshCw } from "lucide-react";
import AchievementTable from "../../../components/Admin/achievement/AchievementTable";
import AchievementModal from "../../../components/Admin/achievement/AchievementModal";

const ListAchievement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedAchievement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (achievement) => {
    setModalMode("edit");
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Kelola Prestasi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manajemen data prestasi mahasiswa, dosen, dan prodi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 
              text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 
              dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 
              text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm 
              hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Prestasi</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <AchievementTable 
          onEdit={handleEdit} 
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AchievementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          achievement={selectedAchievement}
          mode={modalMode}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ListAchievement;
