// src/components/Admin/Lecturer/LecturerModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { env } from "../../../services/utils/env";

const LecturerModal = ({ isOpen, onClose, onSave, lecturer, mode }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    expertise: [],
    externalLink: "",
    photo: "",
    photoFile: null,
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (lecturer && mode === "edit") {
      setFormData({
        username: lecturer.username || "",
        fullname: lecturer.fullname || "",
        email: lecturer.email || "",
        expertise: lecturer.expertise || [],
        externalLink: lecturer.externalLink || "",
        photo: lecturer.photo || "",
        photoFile: null,
      });
      setPhotoPreview(lecturer.photo ? env.BACKEND_URL + lecturer.photo : "");
    } else {
      setFormData({
        username: "",
        fullname: "",
        email: "",
        expertise: [],
        externalLink: "",
        photo: "",
        photoFile: null,
      });
      setPhotoPreview("");
    }
    setErrors({});
    setTouched({});
  }, [lecturer, mode, isOpen]);

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "username":
        if (!value || value.trim().length === 0) {
          error = "Username wajib diisi";
        } else if (value.length < 4) {
          error = "Username minimal 4 karakter";
        } else if (value.length > 100) {
          error = "Username maksimal 100 karakter";
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          error =
            "Username hanya boleh berisi huruf, angka, titik, underscore, dan dash";
        }
        break;

      case "fullname":
        if (!value || value.trim().length === 0) {
          error = "Nama lengkap wajib diisi";
        } else if (value.length < 4) {
          error = "Nama lengkap minimal 4 karakter";
        } else if (value.length > 100) {
          error = "Nama lengkap maksimal 100 karakter";
        }
        break;

      case "email":
        if (!value || value.trim().length === 0) {
          error = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Format email tidak valid";
        }
        break;

      case "externalLink":
        if (value && value.trim().length > 0) {
          try {
            new URL(value);
          } catch {
            error = "Link harus berupa URL valid";
          }
        }
        break;

      case "expertise":
        if (!Array.isArray(value) || value.length === 0) {
          error = "Minimal harus ada 1 keahlian";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleAddExpertise = () => {
    if (
      newExpertise.trim() &&
      !formData.expertise.includes(newExpertise.trim())
    ) {
      const updatedExpertise = [...formData.expertise, newExpertise.trim()];
      handleChange("expertise", updatedExpertise);
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index) => {
    const updatedExpertise = formData.expertise.filter((_, i) => i !== index);
    handleChange("expertise", updatedExpertise);
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "File harus berupa gambar" }));
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Ukuran file maksimal 5MB" }));
      return;
    }

    setUploadingPhoto(true);
    try {
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
      }));
      setPhotoPreview(URL.createObjectURL(file));

      // Clear error photo jika ada
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrors((prev) => ({ ...prev, photo: "Gagal mengupload foto" }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      username: true,
      fullname: true,
      email: true,
      expertise: true,
      externalLink: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(allTouched).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      // Handle error dari backend
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Terjadi kesalahan saat menyimpan data" });
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );

  if (!isOpen) return null;

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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "create" ? "Tambah Dosen Baru" : "Edit Dosen"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <ErrorMessage message={errors.general} />
            </div>
          )}

          <div className="space-y-4">
            {/* Foto Profil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto Profil (Opsional)
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
                      ${
                        uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""
                      }`}>
                    <Upload className="w-5 h-5" />
                    {uploadingPhoto ? "Mengupload..." : "Upload Foto"}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Format: JPG, PNG (Maksimal 5MB)
                  </p>
                  {errors.photo && <ErrorMessage message={errors.photo} />}
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
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="ahmad.wijaya"
                className={`w-full px-4 py-2.5 rounded-lg border 
                  ${
                    errors.username
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors`}
              />
              {errors.username && <ErrorMessage message={errors.username} />}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.username.length}/100 karakter (minimum 4)
              </p>
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
                onChange={(e) => handleChange("fullname", e.target.value)}
                onBlur={() => handleBlur("fullname")}
                placeholder="Dr. Ahmad Wijaya, M.Kom"
                className={`w-full px-4 py-2.5 rounded-lg border 
                  ${
                    errors.fullname
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors`}
              />
              {errors.fullname && <ErrorMessage message={errors.fullname} />}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.fullname.length}/100 karakter (minimum 4)
              </p>
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
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="ahmad.wijaya@fti.uksw.edu"
                className={`w-full px-4 py-2.5 rounded-lg border 
                  ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors`}
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            {/* External Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link Eksternal (Opsional)
              </label>
              <input
                type="url"
                name="externalLink"
                value={formData.externalLink}
                onChange={(e) => handleChange("externalLink", e.target.value)}
                onBlur={() => handleBlur("externalLink")}
                placeholder="https://scholar.google.com/..."
                className={`w-full px-4 py-2.5 rounded-lg border 
                  ${
                    errors.externalLink
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                  transition-colors`}
              />
              {errors.externalLink && (
                <ErrorMessage message={errors.externalLink} />
              )}
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keahlian <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  name="expertise"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExpertise();
                    }
                  }}
                  placeholder="Machine Learning"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {errors.expertise && <ErrorMessage message={errors.expertise} />}
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
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              {formData.expertise.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Minimal harus ada 1 keahlian
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-gray-700 dark:text-gray-300 
                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-500 dark:hover:bg-blue-600 text-white 
                rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? "Menyimpan..."
                : mode === "create"
                ? "Tambah"
                : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LecturerModal;
