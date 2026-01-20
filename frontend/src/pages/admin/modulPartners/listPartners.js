import React, { useState } from "react";
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

// Mock data for preview
const mockPartners = [
  {
    id: 1,
    company: "CTI Group",
    logo: "https://via.placeholder.com/200x80?text=CTI+Group",
    link: "https://ctigroup.com",
    scale: 1,
  },
  {
    id: 2,
    company: "Colorful",
    logo: "https://via.placeholder.com/200x80?text=Colorful",
    link: "https://colorful.com",
    scale: 1,
  },
  {
    id: 3,
    company: "Sinarmas",
    logo: "https://via.placeholder.com/200x80?text=Sinarmas",
    link: "https://sinarmas.com",
    scale: 1,
  },
  {
    id: 4,
    company: "BCA",
    logo: "https://via.placeholder.com/200x80?text=BCA",
    link: "https://bca.co.id",
    scale: 1,
  },
  {
    id: 5,
    company: "Alfamart",
    logo: "https://via.placeholder.com/200x80?text=Alfamart",
    link: "https://alfamart.com",
    scale: 1,
  },
  {
    id: 6,
    company: "Indomaret",
    logo: "https://via.placeholder.com/200x80?text=Indomaret",
    link: "https://indomaret.co.id",
    scale: 1,
  },
];

const ListPartners = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    link: "",
    logo: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredPartners = partners.filter((partner) =>
    partner.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        company: partner.company,
        link: partner.link || "",
        logo: partner.logo,
        scale: partner.scale || 1,
      });
      setImagePreview(partner.logo);
    } else {
      setEditingPartner(null);
      setFormData({ company: "", link: "", logo: "", scale: 1 });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData({ company: "", link: "", logo: "", scale: 1 });
    setImagePreview("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.company.trim()) {
      alert("Company name is required");
      return;
    }

    if (editingPartner) {
      setPartners(
        partners.map((p) =>
          p.id === editingPartner.id ? { ...p, ...formData } : p,
        ),
      );
    } else {
      const newPartner = {
        id: Date.now(),
        ...formData,
      };
      setPartners([...partners, newPartner]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    setPartners(partners.filter((p) => p.id !== id));
    setDeleteConfirm(null);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-4">
            <h2 className="text-xl text-white font-semibold">Live Preview</h2>
            <p className="text-blue-100 text-sm mt-1">
              Tampilan carousel partner di website
            </p>
          </div>
          <KerjaSamaPreview partners={partners} />
        </div>

        {/* Partners List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 p-4">
            <h2 className="text-xl text-white font-semibold">Daftar Partner</h2>
            <p className="text-purple-100 text-sm mt-1">
              Total: {filteredPartners.length} partner
            </p>
          </div>

          <div className="p-4">
            {/* Partners List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPartners.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada partner ditemukan
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
                      src={partner.logo}
                      alt={partner.company}
                      className="w-20 h-16 rounded-lg object-contain border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Scale: {partner.scale}x
                      </p>
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
                className="text-white hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Logo Partner
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-24 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 flex items-center justify-center">
                      <img
                        src={imagePreview}
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
                        Klik untuk upload
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-400 
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                    transition-colors"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                    dark:border-gray-700 bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-white placeholder-gray-400 
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                    transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-lg 
                    hover:bg-gray-300 dark:hover:bg-gray-600 
                    transition-colors font-medium">
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                    hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium 
                    flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Save className="w-4 h-4" />
                  {editingPartner ? "Update" : "Simpan"}
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
