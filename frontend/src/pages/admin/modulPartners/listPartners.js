import React, { useEffect, useState } from "react";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Upload,
  Search,
} from "lucide-react";

import { KerjaSamaPreview } from "../../../components/Admin/partner/KerjaSamaPreview";
import {
  createPartner,
  editPartner,
  deletePartner,
  getAllPartner,
  uploadPartnerImage,
} from "../../../services/partner.service";
import { useToast } from "../../../context/toastProvider";
import { env } from "../../../services/utils/env";

const ListPartners = () => {
  const toast = useToast();
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    link: "",
    logo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter partners
  const filteredPartners = partners.filter((partner) =>
    partner.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await getAllPartner();
      setPartners(response.data || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Gagal memuat data partner");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open modal
  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        company: partner.company,
        link: partner.link || "",
        logo: partner.logo,
      });
      setImagePreview(partner.logo);
    } else {
      setEditingPartner(null);
      setFormData({ company: "", link: "", logo: "" });
      setImagePreview("");
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData({ company: "", link: "", logo: "" });
    setImagePreview("");
    setImageFile(null);
    setIsSubmitting(false);
  };

  // Handle image upload with validation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WEBP)!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageFile(file);
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file!");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.company.trim()) {
      toast.error("Nama perusahaan wajib diisi!");
      return;
    }

    if (!editingPartner && !imageFile && !formData.logo) {
      toast.error("Logo partner wajib diupload!");
      return;
    }

    setIsSubmitting(true);
    let logoPath = formData.logo;

    try {
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("photo", imageFile);

        const uploadResponse = await uploadPartnerImage(formDataUpload);

        if (
          uploadResponse.statusCode === 200 ||
          uploadResponse.statusCode === 201
        ) {
          logoPath = uploadResponse.data.path;
        } else {
          toast.error(uploadResponse.message || "Gagal upload logo!");
          setIsSubmitting(false);
          return;
        }
      }

      const dataToSave = {
        company: formData.company.trim(),
        link: formData.link.trim(),
        image: logoPath,
      };

      if (editingPartner) {
        const response = await editPartner(editingPartner.id, dataToSave);
        if (response.statusCode === 200) {
          toast.success("Partner berhasil diupdate!");
          fetchData();
          handleCloseModal();
        } else {
          toast.error(response.message || "Gagal mengupdate partner!");
        }
      } else {
        const response = await createPartner(dataToSave);
        if (response.statusCode === 201) {
          toast.success("Partner berhasil ditambahkan!");
          fetchData();
          handleCloseModal();
        } else {
          toast.error(response.message || "Gagal menambahkan partner!");
        }
      }
      fetchData();
      return;
    } catch (error) {
      console.error("Save error:", error);

      if (error.response?.data?.message === "VALIDATION_ERROR") {
        const validationErrors = error.response.data.errors || {};
        Object.entries(validationErrors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data!",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await deletePartner(id);

      if (response.statusCode === 200) {
        toast.success("Partner berhasil dihapus!");
        fetchData();
      } else {
        toast.error(response.message || "Gagal menghapus partner!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus partner!",
      );
    } finally {
      setDeleteConfirm(null);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Partners Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kelola data mitra kerja sama institusi
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Partner
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari partner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 
            dark:border-gray-700 bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Preview Carousel
            </h2>
          </div>
          <KerjaSamaPreview partners={partners} />
        </div>

        {/* Partners List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Daftar Partner
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {filteredPartners.length} partner
            </p>
          </div>

          <div className="p-4">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPartners.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Tidak ada partner yang cocok"
                      : "Belum ada partner"}
                  </p>
                </div>
              ) : (
                filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 
                      dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 
                      transition-colors">
                    <img
                      src={env.BACKEND_URL + partner.image}
                      alt={partner.company}
                      className="w-16 h-12 rounded object-contain bg-gray-50 dark:bg-gray-900 p-1"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {partner.company}
                      </h3>
                      {partner.link && (
                        <a
                          href={partner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline truncate">
                          <span className="truncate">{partner.link}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenModal(partner)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                          dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(partner.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 
                          dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {editingPartner ? "Edit Partner" : "Tambah Partner"}
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                  transition-colors disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo Partner{" "}
                  {!editingPartner && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-3">
                  {(imagePreview || editingPartner?.image) && (
                    <div className="w-20 h-16 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 flex items-center justify-center flex-shrink-0">
                      <img
                        src={
                          imagePreview || env.BACKEND_URL + editingPartner.image
                        }
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 
                      rounded-lg p-3 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 block">
                        {imagePreview ? "Ganti logo" : "Upload logo"}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">Max 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpg, image/png, image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Nama perusahaan"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                    rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 
                    text-white rounded-lg transition-colors flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" />
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingPartner
                      ? "Update"
                      : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Konfirmasi Penghapusan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Apakah Anda yakin ingin menghapus partner ini?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 
                  text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                  rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 
                  text-white rounded-lg transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPartners;
