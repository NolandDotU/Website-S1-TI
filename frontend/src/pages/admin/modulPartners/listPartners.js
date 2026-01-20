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

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WEBP)!");
      e.target.value = "";
      return;
    }

    // Validasi ukuran file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB!");
      e.target.value = "";
      return;
    }

    // Buat preview
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
    // Prevent double submit
    if (isSubmitting) return;

    // Validasi nama perusahaan
    if (!formData.company.trim()) {
      toast.error("Nama perusahaan wajib diisi!");
      return;
    }

    // Validasi gambar untuk partner baru
    if (!editingPartner && !imageFile && !formData.logo) {
      toast.error("Logo partner wajib diupload!");
      return;
    }

    setIsSubmitting(true);
    let logoPath = formData.logo;

    try {
      // Upload gambar jika ada file baru
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("photo", imageFile);

        const uploadResponse = await uploadPartnerImage(formDataUpload);
        console.log("Upload response:", uploadResponse);

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

      // Prepare data untuk save
      const dataToSave = {
        company: formData.company.trim(),
        link: formData.link.trim(),
        image: logoPath,
      };

      // Save data
      if (editingPartner) {
        // UPDATE
        console.log("DATA TO SAVE:", dataToSave);
        const response = await editPartner(editingPartner.id, dataToSave);

        if (response.statusCode === 200) {
          toast.success("Partner berhasil diupdate!");
          fetchData();
          handleCloseModal();
        } else {
          toast.error(response.message || "Gagal mengupdate partner!");
        }
      } else {
        // CREATE
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

      // Handle validation errors
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Partners Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data mitra kerja sama institusi
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
            transition-colors font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Tambah Partner
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama perusahaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
              dark:border-gray-700 bg-white dark:bg-gray-900 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
              transition-colors"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-4">
            <h2 className="text-xl text-white font-semibold">Live Preview</h2>
            <p className="text-blue-100 text-sm mt-1">
              Tampilan carousel partner di website
            </p>
          </div>
          <KerjaSamaPreview partners={partners} />
        </div>

        {/* Partners List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-4">
            <h2 className="text-xl text-white font-semibold">Daftar Partner</h2>
            <p className="text-blue-100 text-sm mt-1">
              Total: {filteredPartners.length} partner
            </p>
          </div>

          <div className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPartners.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "Tidak ada partner yang cocok dengan pencarian"
                      : "Belum ada partner yang ditambahkan"}
                  </p>
                </div>
              ) : (
                filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                      rounded-lg p-4 flex items-center gap-4 hover:border-blue-500 
                      dark:hover:border-blue-400 transition-colors">
                    <img
                      src={env.BACKEND_URL + partner.image}
                      alt={partner.company}
                      className="w-20 h-16 rounded-lg object-contain border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 dark:text-white font-semibold truncate">
                        {partner.company}
                      </h3>
                      {partner.link && (
                        <a
                          href={partner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline truncate">
                          <span className="truncate">{partner.link}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenModal(partner)}
                        className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                          hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(partner.id)}
                        className="p-2 bg-red-600 dark:bg-red-500 text-white rounded-lg 
                          hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl text-white font-semibold">
                {editingPartner ? "Edit Partner" : "Tambah Partner Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-white hover:text-gray-200 transition-colors disabled:opacity-50">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Logo Partner{" "}
                  {!editingPartner && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-4">
                  {(imagePreview || editingPartner?.image) && (
                    <div className="w-24 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 flex items-center justify-center">
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
                      rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-400 
                      transition-colors bg-gray-50 dark:bg-gray-900">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {imagePreview ? "Ganti logo" : "Klik untuk upload"}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Max 5MB (JPG, PNG)
                      </p>
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
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-400 
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan nama perusahaan"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Website Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-400 
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-lg 
                    hover:bg-gray-300 dark:hover:bg-gray-600 
                    transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                    hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium 
                    flex items-center justify-center gap-2 shadow-md hover:shadow-lg
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl text-gray-900 dark:text-white font-semibold mb-4">
              Konfirmasi Penghapusan!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Anda yakin ingin menghapus partner ini? Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 
                  text-gray-700 dark:text-gray-300 rounded-lg 
                  hover:bg-gray-300 dark:hover:bg-gray-600 
                  transition-colors font-medium">
                Tidak
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 dark:bg-red-500 text-white rounded-lg 
                  hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium 
                  shadow-md hover:shadow-lg">
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPartners;
