// ==================== HighlightManage.jsx ====================
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Search, Image as ImageIcon } from "lucide-react";
import Carousel from "../../../components/Carousel";
import HighlightCarouselTable from "../../../components/Admin/highlight/HighlightCarouselTable";
import HighlightModal from "../../../components/Admin/highlight/CostumHighlightModal";
import ModalConfirmation from "../../../components/Admin/ModalConfirmation";
import SlideListAnnouncement from "../../../components/Admin/highlight/SlideListAnnouncement";
import {
  adminGetAnnouncements,
  getAnnouncements,
  update,
  createHighlight,
  deleteHighlight,
  getAllHighlight,
  updateHighlight,
  uploadPhotoHighlight,
} from "../../../services/api";
import { useToast } from "../../../context/toastProvider";

const HighlightManage = () => {
  const toast = useToast();
  const [carousel, setCarousel] = useState([]);
  const [announcement, setAnnouncement] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [announLoading, setAnnounLoading] = useState(false);
  const [searchCarousel, setSearchCarousel] = useState("");
  const [searchAnnouncement, setSearchAnnouncement] = useState("");
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Modal states
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [deleteType, setDeleteType] = useState(""); // 'carousel' or 'announcement'

  // Pagination
  const [carouselPage, setCarouselPage] = useState(1);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [carouselTotalPages, setCarouselTotalPages] = useState(1);

  useEffect(() => {
    fetchCarousel();
    fetchAnnouncements();
  }, [searchCarousel, searchAnnouncement, carouselPage, announcementPage]);

  const fetchCarousel = async () => {
    setCarouselLoading(true);
    try {
      const response = await getAllHighlight();
      setCarousel(response.data);
      setCarouselTotalPages(response.totalPages);
      setCarouselLoading(false);
    } catch (error) {
      console.error("Error fetching carousel:", error);
      setCarouselLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setAnnounLoading(true);
    try {
      const response = await adminGetAnnouncements();
      if (response.status !== 200) {
        return toast.error(response.message);
      }
      setAnnouncement(response.announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnounLoading(false);
    }
  };

  // Carousel handlers
  const handleCreateCarousel = () => {
    setModalMode("create");
    setSelectedItem(null);
    setIsCarouselModalOpen(true);
  };

  const handleEditCarousel = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setIsCarouselModalOpen(true);
  };

  const handleDeleteCarousel = (item) => {
    setSelectedItem(item);
    console.log("SELECTED DELETE ITEM", selectedItem);
    setDeleteType("carousel");
    setIsDeleteModalOpen(true);
  };

  const handleAnnouncementToCarousel = (item) => {
    setSelectedItem(item);
    setIsAnnouncementModalOpen(true);
  };

  const announcementToCarousel = async () => {
    try {
      const payload = {
        type: "announcement",
        announcementId: selectedItem.id || selectedItem._id,
        order: carousel.length + 1,
      };
      const response = await createHighlight(payload);
      if (response.statusCode !== 201) return toast.error(response.message);
      setIsAnnouncementModalOpen(false);
      await fetchCarousel();
    } catch (error) {
      console.error("Error saving announcement to carousel:", error);
      toast.error(`Terjadi kesalahan ${error.response?.data?.message}`);
    }
  };

  const handleSaveCarousel = async (formData) => {
    try {
      let payload = {};
      if (formData.customContent.imageUrl) {
        const photoResponse = await uploadPhotoHighlight(
          formData.customContent.imageUrl,
        );
        if (photoResponse.statusCode !== 200)
          return toast.error(photoResponse.message);
        payload = {
          ...formData,
          customContent: {
            ...formData.customContent,
            imageUrl: photoResponse.data.path,
          },
        };
      }
      if (modalMode === "create") {
        const response = await createHighlight(payload);
        if (response.statusCode !== 201) return toast.error(response.message);
        fetchCarousel();
        toast.success(response.message);
      } else {
        const response = await updateHighlight(selectedItem._id, formData);
        if (response.statusCode !== 200) return toast.error(response.message);
        setCarousel(
          carousel.map((item) =>
            item._id === selectedItem._id ? { ...item, ...formData } : item,
          ),
        );
      }
      setIsCarouselModalOpen(false);
      fetchCarousel();
    } catch (error) {
      console.error("Error saving carousel:", error);
      toast.error(`Terjadi kesalahan ${error.response?.data?.message}`);
    }
  };

  // Delete handler
  const confirmDelete = async () => {
    try {
      const response = await deleteHighlight(
        selectedItem._id || selectedItem.id,
      );
      await fetchCarousel();
      if (response.statusCode !== 200) return toast.error(response.message);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`Terjadi kesalahan ${error.response?.data?.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Highlight Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola konten highlight yang ditampilkan di halaman utama
          </p>
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Preview Highlight
        </h2>

        {/* Carousel Preview */}
        <div className="mb-6 w-auto h-auto ">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Carousel Banner
          </h3>
          {carousel.length > 0 ? (
            <Carousel slides={carousel} />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada carousel banner
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Carousel Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Carousel Banner
          </h2>
          <button
            onClick={handleCreateCarousel}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
              dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
              transition-colors font-medium shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5" />
            Tambah Carousel
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <SlideListAnnouncement
            data={announcement}
            onCarousel={carousel}
            onAddToCarousel={handleAnnouncementToCarousel}
          />
        </div>

        <HighlightCarouselTable
          items={carousel}
          loading={carouselLoading}
          page={carouselPage}
          totalPages={carouselTotalPages}
          onPageChange={setCarouselPage}
          onEdit={handleEditCarousel}
          onDelete={handleDeleteCarousel}
        />
      </motion.div>

      <AnimatePresence>
        {/* MODAL CREATE OR EDITING CAROUSEL COSTUM */}
        {isCarouselModalOpen && (
          <HighlightModal
            isOpen={isCarouselModalOpen}
            onClose={() => setIsCarouselModalOpen(false)}
            onSave={handleSaveCarousel}
            item={selectedItem}
            mode={modalMode}
            type="carousel"
          />
        )}

        {/* MODAL CREATE OR EDITING ANNOUNCEMENT */}
        {isAnnouncementModalOpen && (
          <ModalConfirmation
            isOpen={isAnnouncementModalOpen}
            type="info"
            onClose={() => setIsAnnouncementModalOpen(false)}
            onConfirm={announcementToCarousel}
            cancelText="Batal"
            confirmText="Tambah"
            title="Konfirmasi Highlight!"
            message={
              selectedItem.status === "published"
                ? `Anda yakin ingin menambahkan pengumuman "${selectedItem.title}" ke carousel?`
                : `Anda yakin ingin menambahkan pengumuman "${selectedItem.title}" ke carousel? Status pengumuman akan diubah menjadi "Published".`
            }
          />
        )}

        {/*DELETE CONFIRMATION MODAL  */}
        {isDeleteModalOpen && (
          <ModalConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Konfirmasi Penghapusan"
            message={`Anda yakin ingin menghapus "${
              selectedItem.type === "announcement"
                ? selectedItem.announcementId.title
                : selectedItem.customContent.title
            }" dari Carousel?`}
            type="warning"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HighlightManage;
