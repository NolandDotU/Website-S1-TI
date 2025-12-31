import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../context/toastProvider";
import {
  getLecturers,
  createLecturer,
  deleteLecturer,
  updateLecturer,
  uploadPhoto,
} from "../../../services/lecturerAPI";
import LecturerTable from "../../../components/Admin/lecturer/LecturerTable";
import LecturerModal from "../../../components/Admin/lecturer/LecturerModel";
import { Search, Plus, Users } from "lucide-react";
import ModalConfirmation from "../../../components/Admin/ModalConfirmation";

const LecturerManagement = () => {
  const toast = useToast();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const fetchLecturers = async () => {
    setLoading(true);
    try {
      const data = await getLecturers(page, limit, search);
      console.log("Fetched lecturers:", data);
      setLecturers(data.lecturers || data);
      setTotalPages(data.meta.totalPages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lecturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, [page, search]);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedLecturer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lecturer) => {
    setModalMode("edit");
    setSelectedLecturer(lecturer);
    setIsModalOpen(true);
  };

  const handleDelete = (lecturer) => {
    setSelectedLecturer(lecturer);
    console.log("Selected lecturer for deletion:", lecturer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLecturer(selectedLecturer.id, selectedLecturer.photo);
      toast.success("Lecturer deleted successfully");
      fetchLecturers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecturer");
    }
  };

  const handleSave = async (data) => {
    console.log("Saving lecturer data:", data);
    const { photoFile, ...lecturerData } = data;
    if (photoFile) {
      try {
        const uploadResult = await uploadPhoto(photoFile);
        console.log("Photo uploaded successfully:", uploadResult);
        lecturerData.photo = uploadResult.data.path;
        console.log("Updated lecturer data:", lecturerData);
      } catch (error) {
        toast.error(error.message || "Failed to upload photo");
        return;
      }
    }
    try {
      if (modalMode === "create") {
        await createLecturer(lecturerData);
        toast.success("Lecturer created successfully");
      } else {
        await updateLecturer(selectedLecturer.id, lecturerData);
        toast.success("Lecturer updated successfully");
      }
      fetchLecturers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save lecturer");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Dosen Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data dosen Program Studi S1 Teknik Informatika
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
            transition-colors font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Tambah Dosen
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Cari berdasarkan nama atau email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
              dark:border-gray-700 bg-white dark:bg-gray-900 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
              transition-colors"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <LecturerTable
          lecturers={lecturers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <LecturerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            lecturer={selectedLecturer}
            mode={modalMode}
          />
        )}

        {isDeleteModalOpen && (
          <ModalConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Konfirmasi Penghapusan!"
            message={`Anda yakin ingin menghapus dosen ${selectedLecturer?.fullname}?`}
            cancelText="Tidak"
            confirmText="Yakin"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LecturerManagement;
