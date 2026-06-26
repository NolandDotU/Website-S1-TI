import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Upload, FileText, ImageIcon } from "lucide-react";
import { useToast } from "../../../context/toastProvider";
import MDEditor from "@uiw/react-md-editor";
import { env } from "../../../services/utils/env";
import {
  createAchievement,
  updateAchievement,
  uploadAchievementImage,
  uploadAchievementCertificate,
} from "../../../services/api";

const AchievementModal = ({
  isOpen,
  onClose,
  achievement,
  mode,
  onSuccess,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    recipient: "",
    category: "",
    level: "",
    organizer: "",
    achievementDate: "",
    description: "",
    image: null,
    certificate: null,
  });

  useEffect(() => {
    setErrors({});
    if (achievement && mode === "edit") {
      setFormData({
        id: achievement._id || achievement.id,
        title: achievement.title || "",
        recipient: achievement.recipient || "",
        category: achievement.category || "",
        level: achievement.level || "",
        organizer: achievement.organizer || "",
        achievementDate: achievement.achievementDate 
          ? new Date(achievement.achievementDate).toISOString().split('T')[0] 
          : "",
        description: achievement.description || "",
        image: achievement.image || null,
        certificate: achievement.certificate || null,
      });
    } else {
      setFormData({
        title: "",
        recipient: "",
        category: "",
        level: "",
        organizer: "",
        achievementDate: "",
        description: "",
        image: null,
        certificate: null,
      });
    }
  }, [achievement, mode, isOpen]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      let payload = { ...formData };

      // Handle Image Upload
      if (formData.image instanceof File) {
        try {
          const uploads = await uploadAchievementImage(formData.image);
          if (uploads.statusCode !== 200) {
            toast.error("Gagal menyimpan foto!");
            setIsSubmitting(false);
            return;
          }
          payload.image = uploads.data.path;
        } catch (error) {
          toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan foto!");
          setIsSubmitting(false);
          return;
        }
      }

      // Handle Certificate Upload
      if (formData.certificate instanceof File) {
        try {
          const uploads = await uploadAchievementCertificate(formData.certificate);
          if (uploads.statusCode !== 200) {
            toast.error("Gagal menyimpan sertifikat!");
            setIsSubmitting(false);
            return;
          }
          payload.certificate = uploads.data.path;
        } catch (error) {
          toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan sertifikat!");
          setIsSubmitting(false);
          return;
        }
      }

      // API Call
      if (mode === "create") {
        const response = await createAchievement(payload);
        if (response.statusCode !== 201) {
          toast.error(response.message || "Gagal menyimpan prestasi");
          setIsSubmitting(false);
          return;
        }
      } else {
        const response = await updateAchievement(payload, payload.id);
        if (response.statusCode !== 200) {
          toast.error(response.message || "Gagal mengupdate prestasi");
          setIsSubmitting(false);
          return;
        }
      }

      toast.success(mode === "create" ? "Prestasi berhasil ditambahkan!" : "Prestasi berhasil diupdate!");
      onSuccess();
      onClose();
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "VALIDATION_ERROR"
      ) {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
        toast.error("Terdapat kesalahan validasi pada form");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilePreview = (fileData, type) => {
    if (!fileData) return null;
    if (fileData instanceof File) {
      if (type === 'image') return URL.createObjectURL(fileData);
      return fileData.name; // For PDF/docs
    }
    if (typeof fileData === "string") {
      if (fileData.startsWith("http")) return fileData;
      return `${env.IMAGE_BASE_URL}${fileData}`;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Tambah Prestasi" : "Edit Prestasi"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Isi formulir di bawah ini dengan lengkap.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Judul Prestasi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Judul Prestasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Juara 1 Gemastik 2026"
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Penerima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="Nama individu / tim"
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  ${errors.recipient ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {errors.recipient && <p className="text-red-500 text-xs mt-1">{errors.recipient}</p>}
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Diperoleh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.achievementDate}
                onChange={(e) => setFormData({ ...formData, achievementDate: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  ${errors.achievementDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {errors.achievementDate && <p className="text-red-500 text-xs mt-1">{errors.achievementDate}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  ${errors.category ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Dosen">Dosen</option>
                <option value="Program Studi">Program Studi</option>
                <option value="Alumni">Alumni</option>
                <option value="Organisasi">Organisasi</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Tingkat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tingkat <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  ${errors.level ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                  text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              >
                <option value="" disabled>Pilih Tingkat</option>
                <option value="Internasional">Internasional</option>
                <option value="Nasional">Nasional</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                <option value="Universitas">Universitas</option>
                <option value="Fakultas">Fakultas</option>
                <option value="Program Studi">Program Studi</option>
              </select>
              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
            </div>

            {/* Penyelenggara */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Penyelenggara (Opsional)
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="Penyelenggara acara / perlombaan"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Deskripsi MD */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi
              </label>
              <div data-color-mode="light" className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val || "" })}
                  preview="edit"
                  height={250}
                />
              </div>
            </div>

            {/* Foto Dokumentasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto Dokumentasi
              </label>
              {formData.image && (
                <div className="mb-3 relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getFilePreview(formData.image, 'image')}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: null })}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files[0]) setFormData({ ...formData, image: e.target.files[0] });
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pilih Foto (JPG/PNG/WEBP)</span>
                </label>
              </div>
            </div>

            {/* Sertifikat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sertifikat (Gambar / PDF)
              </label>
              {formData.certificate && (
                <div className="mb-3 relative p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-8 h-8 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {formData.certificate instanceof File ? formData.certificate.name : "Sertifikat terlampir"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, certificate: null })}
                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => {
                    if (e.target.files[0]) setFormData({ ...formData, certificate: e.target.files[0] });
                  }}
                  className="hidden"
                  id="cert-upload"
                />
                <label
                  htmlFor="cert-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pilih File (PDF/JPG/PNG)</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{mode === "create" ? "Simpan Prestasi" : "Simpan Perubahan"}</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementModal;
