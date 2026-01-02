import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { env } from "../../../services/utils/env";

const AnnouncementModal = ({ isOpen, onClose, onSave, announcement, mode }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "pengumuman",
    photo: null,
    status: "draft",
    scheduleDate: null,
  });

  useEffect(() => {
    if (announcement && mode === "edit") {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        photo: announcement.photo,
        status: announcement.status,
        scheduleDate: announcement.scheduleDate,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        photo: null,
        category: "",
        status: "draft",
        scheduleDate: null,
      });
    }
  }, [announcement, mode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const getPhotoPreview = () => {
    if (!formData.photo) return null;

    // If it's a File object (new upload)
    if (formData.photo instanceof File) {
      return URL.createObjectURL(formData.photo);
    }

    // If it's a string (existing photo from backend)
    if (typeof formData.photo === "string") {
      // Check if it already has the full URL
      if (formData.photo.startsWith("http")) {
        return formData.photo;
      }
      // Otherwise, prepend the backend URL
      return `${env.BACKEND_URL || "http://localhost:5000"}/${formData.photo}`;
    }

    return null;
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "create" ? "Tambah Pengumuman" : "Edit Pengumuman"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Judul Pengumuman
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masukkan judul pengumuman..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white placeholder-gray-400 
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors">
                <option value="pengumuman">Pengumuman</option>
                <option value="event">Event</option>
                <option value="lowongan">Lowongan</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konten Pengumuman
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value || "" })
                  }
                  preview="edit"
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto Pengumuman
              </label>

              {/* Photo Preview */}
              {getPhotoPreview() && (
                <div className="mb-3 relative">
                  <img
                    src={getPhotoPreview()}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: null })}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 
                      text-white rounded-lg transition shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200
                  dark:hover:file:bg-blue-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: JPG, PNG, GIF (Maksimal 5MB)
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Schedule Date (if scheduled) */}
            {formData.status === "scheduled" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Publikasi
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduleDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduleDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                    dark:border-gray-600 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white 
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                    transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 dark:text-gray-300 
              bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
              rounded-lg transition font-medium">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
              dark:bg-blue-500 dark:hover:bg-blue-600 text-white 
              rounded-lg transition font-medium">
            {mode === "create" ? "Simpan" : "Update"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnnouncementModal;
