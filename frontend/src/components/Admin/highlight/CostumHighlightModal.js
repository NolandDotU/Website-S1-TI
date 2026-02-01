import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useToast } from "../../../context/toastProvider";
import {
  uploadPhotoHighlight,
  createHighlight,
  updateHighlight,
} from "../../../services/api";

const HighlightModal = ({ isOpen, onClose, isSave, item, mode }) => {
  const toast = useToast();
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    type: "custom",
    announcementId: "",
    customContent: {
      title: "",
      description: "",
      imageUrl: "",
      link: "",
    },
    order: 1,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData({
        type: item.type || "announcement",
        announcementId: item.announcementId || "",
        customContent: {
          title: item.customContent?.title || "",
          description: item.customContent?.description || "",
          imageUrl: item.customContent?.imageUrl || "",
          link: item.customContent?.link || "",
        },
        order: item.order || 1,
      });
    } else {
      setFormData({
        type: "custom",
        announcementId: "",
        customContent: {
          title: "",
          description: "",
          imageUrl: "",
          link: "",
        },
        order: 1,
      });
    }
  }, [item, mode, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        customContent: { ...formData.customContent, imageUrl: file },
      });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const submitData = {
      type: formData.type,
      order: formData.order,
    };

    if (formData.type === "announcement") {
      submitData.announcementId = formData.announcementId;
    } else {
      submitData.customContent = {
        title: formData.customContent.title,
        description: formData.customContent.description,
        imageUrl: formData.customContent.imageUrl,
        ...(formData.customContent.link && {
          link: formData.customContent.link,
        }),
      };
    }

    handleSaveCarousel(submitData);
  };

  const handleSaveCarousel = async (formData) => {
    try {
      let payload = { ...formData };
      if (
        mode === "create" &&
        (formData.customContent.imageUrl === null ||
          formData.customContent.imageUrl === "")
      ) {
        setError((prev) => ({
          ...prev,
          photo: "Gambar tidak boleh kosong",
        }));
        toast.error("Gambar tidak boleh kosong");
        return;
      }
      const photoResponse = await uploadPhotoHighlight(
        formData.customContent.imageUrl,
      );
      if (photoResponse.statusCode !== 200)
        return toast.error(photoResponse.message);
      payload = {
        ...payload,
        customContent: {
          ...formData.customContent,
          imageUrl: photoResponse.data.path,
        },
      };

      console.log("SUBMITED PAYLOAD :", payload);
      if (mode === "create") {
        const response = await createHighlight(payload);
        if (response.statusCode !== 201) return toast.error(response.message);
        isSave();
        toast.success(response.message);
      } else {
        const response = await updateHighlight(item._id, formData);
        if (response.statusCode !== 200) return toast.error(response.message);
      }
      isSave();
    } catch (error) {
      if (error.response?.data?.errors) {
        console.log("ERRORS VALIDAITION :", error.response?.data?.errors);

        Object.keys(error.response?.data?.errors).forEach((key) => {
          setError((prev) => ({
            ...prev,
            [key]: error.response?.data?.errors[key],
          }));
        });
      }
      console.error("Error saving carousel:", error);
      toast.error(`Terjadi kesalahan ${error.response?.data?.message}`);
    }
  };

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
            {mode === "create" ? "Tambah" : "Edit"} Highlight
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
            {/* Custom Content Fields (only for custom type) */}
            {formData.type === "custom" && (
              <>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={formData.customContent.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customContent: {
                          ...formData.customContent,
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukkan judul (max 50 karakter)..."
                    maxLength={50}
                    className={`w-full px-4 py-2.5 rounded-lg border  bg-white dark:bg-gray-900 
                      text-gray-900 dark:text-white placeholder-gray-400 
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                      transition-colors
                      ${error.customContent?.title ? "border-red-500" : "border-gray-300  dark:border-gray-600"}
                      `}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.customContent.title.length}/50 karakter
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    value={formData.customContent.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customContent: {
                          ...formData.customContent,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukkan deskripsi (max 50 karakter)..."
                    maxLength={50}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                      dark:border-gray-600 bg-white dark:bg-gray-900 
                      text-gray-900 dark:text-white placeholder-gray-400 
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                      transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.customContent.description.length}/50 karakter
                  </p>
                </div>

                {/* EXTERNAL LINK */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    External Link
                  </label>
                  <input
                    type="text"
                    value={formData.customContent.link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customContent: {
                          ...formData.customContent,
                          link: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukkan link..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                      dark:border-gray-600 bg-white dark:bg-gray-900 
                      text-gray-900 dark:text-white placeholder-gray-400 
                      focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                      transition-colors resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gambar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 
                  text-gray-900 dark:text-white 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200
                  dark:hover:file:bg-blue-800
                  ${error.photo ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: JPG, PNG (Maksimal 5MB)
                  </p>
                  {error.photo && (
                    <p className="text-xs text-red-500 mt-1">{error.photo}</p>
                  )}
                  {previewImage && (
                    <div className="mt-3">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
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

export default HighlightModal;
