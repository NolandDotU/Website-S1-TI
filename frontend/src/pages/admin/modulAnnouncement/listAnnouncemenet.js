import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Search } from "lucide-react";
import AnnouncementTable from "../../../components/Admin/announcement/AnnouncementTable";
import AnnouncementModal from "../../../components/Admin/announcement/AnnouncementModal";
import ModalConfirmation from "../../../components/Admin/ModalConfirmation";
import {
  adminGetAnnouncements,
  createAnnouncement,
  changeStatus,
  delAnnouncement,
  update,
  uploadImageAnnouncement,
} from "../../../services/api";
import { useToast } from "../../../context/toastProvider";

const ListAnnouncement = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAnnouncements();
  }, [search, page]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await adminGetAnnouncements(page, 10, search);
      setAnnouncements(response.announcements);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Gagal memuat pengumuman");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setModalMode("edit");
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteModalOpen(true);
  };

  const handlePublish = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsPublishModalOpen(true);
  };

  const handleArchive = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsArchiveModalOpen(true);
  };

  const changingStatus = async (reqStatus) => {
    const status = ["draft", "scheduled", "published", "archived"];
    if (status.indexOf(reqStatus) === -1) {
      return toast.error("Status pengumuman tidak valid!");
    }
    try {
      const response = await changeStatus(reqStatus, selectedAnnouncement.id);
      if (response.statusCode !== 200) {
        return toast.error(response.data?.message || "Gagal mengubah status");
      }
      toast.success("Berhasil mengubah status pengumuman!");
      setIsPublishModalOpen(false);
      setIsArchiveModalOpen(false);
      setSelectedAnnouncement(null);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengubah status"
      );
    }
  };

  const SavingHandle = async () => {
    await fetchAnnouncements();
    setSelectedAnnouncement(null);
    toast.success("Berhasil menyimpan pengumuman!");
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const id = selectedAnnouncement.id;
      const response = await delAnnouncement(id);
      if (response.statusCode !== 200) {
        return toast.error(
          response.data?.message || "Gagal menghapus pengumuman"
        );
      }
      toast.success("Berhasil menghapus pengumuman secara permanen!");
      setAnnouncements(
        announcements.filter((a) => a.id !== selectedAnnouncement.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus pengumuman"
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Announcement Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola pengumuman Program Studi S1 Teknik Informatika
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
            transition-colors font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Tambah Pengumuman
        </button>
      </motion.div>

      {/* Search */}
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
            placeholder="Cari berdasarkan judul..."
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
        <AnnouncementTable
          announcements={announcements}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onArchive={handleArchive}
        />
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <AnnouncementModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedAnnouncement(null);
            }}
            announcement={selectedAnnouncement}
            mode={modalMode}
            toast={toast}
            onSuccess={SavingHandle}
          />
        )}

        {isDeleteModalOpen && (
          <ModalConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedAnnouncement(null);
            }}
            onConfirm={confirmDelete}
            title="Hapus Pengumuman"
            message="Apakah Anda yakin ingin menghapus pengumuman ini?"
            confirmText="Hapus"
            cancelText="Batal"
            type="danger"
          />
        )}

        {isArchiveModalOpen && (
          <ModalConfirmation
            isOpen={isArchiveModalOpen}
            onClose={() => {
              setIsArchiveModalOpen(false);
              setSelectedAnnouncement(null);
            }}
            onConfirm={() => changingStatus("archived")}
            title="Arsip Pengumuman"
            message="Apakah Anda yakin ingin mengarsipkan pengumuman ini?"
            confirmText="Arsipkan"
            cancelText="Batal"
            type="warning"
          />
        )}

        {isPublishModalOpen && (
          <ModalConfirmation
            isOpen={isPublishModalOpen}
            onClose={() => {
              setIsPublishModalOpen(false);
              setSelectedAnnouncement(null);
            }}
            onConfirm={() => changingStatus("published")}
            title="Publish Pengumuman"
            message="Apakah Anda yakin ingin mempublikasikan pengumuman ini?"
            confirmText="Publish"
            cancelText="Batal"
            type="success"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListAnnouncement;
