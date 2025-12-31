// src/components/Admin/Lecturer/LecturerModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { uploadPhoto } from "../../../services/lecturerAPI";
import { env } from "../../../services/utils/env";

const LecturerModal = ({ isOpen, onClose, onSave, lecturer, mode }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    expertise: [],
    extenalLink: "",
    photo: "",
    photoFile: null,
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (lecturer && mode === "edit") {
      setFormData({
        username: lecturer.username || "",
        fullname: lecturer.fullname || "",
        email: lecturer.email || "",
        expertise: lecturer.expertise || [],
        extenalLink: lecturer.extenalLink || "",
        photo: lecturer.photo || "",
        photoFile: null,
      });
      setPhotoPreview(env.BACKEND_URL + lecturer.photo || "");
    }
  }, [lecturer, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExpertise = () => {
    if (
      newExpertise.trim() &&
      !formData.expertise.includes(newExpertise.trim())
    ) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, newExpertise.trim()],
      });
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      setFormData({
        ...formData,
        photoFile: file,
      });
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600">
          <h2 className="text-xl font-bold text-white">
            {mode === "create" ? "Tambah Dosen Baru" : "Edit Dosen"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foto Profil
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                    text-white rounded-lg transition-colors cursor-pointer
                    ${uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <Upload className="w-5 h-5" />
                  {uploadingPhoto ? "Mengupload..." : "Upload Foto"}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Format: JPG, PNG. Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="ahmad.wijaya"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Dr. Ahmad Wijaya, M.Kom"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="ahmad.wijaya@fti.uksw.edu"
            />
          </div>

          {/* External Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Eksternal
            </label>
            <input
              type="url"
              name="extenalLink"
              value={formData.extenalLink}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="https://scholar.google.com/..."
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keahlian
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddExpertise())
                }
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="Machine Learning"
              />
              <button
                type="button"
                onClick={handleAddExpertise}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.expertise.map((exp, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 
                    text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  {exp}
                  <button
                    type="button"
                    onClick={() => handleRemoveExpertise(index)}
                    className="hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                dark:hover:bg-gray-700 transition-colors font-medium">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
                transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? "Menyimpan..."
                : mode === "create"
                ? "Tambah"
                : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LecturerModal;
