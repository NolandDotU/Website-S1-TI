import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Context";
import { getLecturersDetail, updateLecturerByEmail } from "../../services/api";
import { useToast } from "../../context/toastProvider";
import { env } from "../../services/utils/env";

const DashboardDosen = () => {
  const user = useAuth().user;
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // State untuk form data
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    expertise: [],
    matakuliah: [],
    email: "",
    kontak: "",
    externalLink: "",
    photo: "",
    isActive: true,
  });

  // State untuk input baru expertise dan matakuliah
  const [newExpertise, setNewExpertise] = useState("");
  const [newMatakuliah, setNewMatakuliah] = useState("");

  const fetchData = async () => {
    try {
      const data = await getLecturersDetail();
      console.log("Fetched lecturer data:", data);
      setFormData(data.data);
    } catch (error) {
      toast.error("Gagal memuat data dosen.");
      console.error("Error fetching lecturer data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

  const handleAddMatakuliah = () => {
    if (
      newMatakuliah.trim() &&
      !formData.matakuliah.includes(newMatakuliah.trim())
    ) {
      setFormData({
        ...formData,
        matakuliah: [...formData.matakuliah, newMatakuliah.trim()],
      });
      setNewMatakuliah("");
    }
  };

  const handleRemoveMatakuliah = (index) => {
    setFormData({
      ...formData,
      matakuliah: formData.matakuliah.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    try {
      const email = user.email;
      const response = await updateLecturerByEmail(email, formData);
      console.log("response", response);
      toast.success("Profil dosen berhasil diperbarui.");
      setIsEditing(false);
      setIsSaving(false);
      fetchData();
      setPreviewImage(null);
    } catch (error) {
      toast.error("Gagal memperbarui profil dosen.");
      console.error("Error updating lecturer profile:", error);
    }
    e.preventDefault();
    setIsSaving(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-20 dark:opacity-30"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-block mb-4 px-6 py-2 bg-white bg-opacity-20 dark:bg-opacity-10 rounded-full border border-white border-opacity-30">
            <span className="text-sm font-semibold tracking-wide">
              DASHBOARD DOSEN
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profil Saya</h1>
          <p className="text-base md:text-lg opacity-90 dark:opacity-80">
            Kelola informasi profil dan data akademik Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Action Buttons */}
          <div className="mb-6 flex justify-end gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Photo & Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Informasi Dasar
                </h2>

                {/* Photo Upload */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-gray-300 dark:border-gray-600">
                      {previewImage || formData.photo ? (
                        <img
                          src={previewImage || env.BACKEND_URL + formData.photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors shadow-md">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Klik ikon kamera untuk mengunggah foto profil
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        minLength={4}
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {formData.username}
                      </p>
                    )}
                  </div>

                  {/* Fullname */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        required
                        minLength={4}
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {formData.fullname}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                      {formData.email}
                    </p>
                  </div>

                  {/* Kontak */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Kontak
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="kontak"
                        value={formData.kontak}
                        onChange={handleInputChange}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {formData.kontak || "-"}
                      </p>
                    )}
                  </div>

                  {/* External Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Link Eksternal (Google Scholar, Portfolio, dll)
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleInputChange}
                        placeholder="https://scholar.google.com/..."
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {formData.externalLink ? (
                          <a
                            href={formData.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline">
                            {formData.externalLink}
                          </a>
                        ) : (
                          "-"
                        )}
                      </p>
                    )}
                  </div>

                  {/* Status Active */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status Aktif (Profil ditampilkan di website)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Expertise Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Bidang Keahlian
                </h2>

                {isEditing && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddExpertise())
                      }
                      placeholder="Tambah bidang keahlian baru..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddExpertise}
                      className="px-6 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
                      Tambah
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {formData.expertise.length > 0 ? (
                    formData.expertise.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700">
                        <span className="text-sm font-medium">{item}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExpertise(index)}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Belum ada bidang keahlian
                    </p>
                  )}
                </div>
              </div>

              {/* Mata Kuliah Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Mata Kuliah yang Diampu
                </h2>

                {isEditing && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={newMatakuliah}
                      onChange={(e) => setNewMatakuliah(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddMatakuliah())
                      }
                      placeholder="Tambah mata kuliah baru..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddMatakuliah}
                      className="px-6 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
                      Tambah
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.matakuliah.length > 0 ? (
                    formData.matakuliah.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-700 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {item}
                          </span>
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMatakuliah(index)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg p-2 transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Belum ada mata kuliah yang diampu
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Info Panel */}
          {!isEditing && (
            <div className="mt-6 bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-700 dark:border-blue-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-800 dark:text-gray-100">
                      Catatan:
                    </strong>{" "}
                    Pastikan informasi profil Anda selalu terkini. Data ini akan
                    ditampilkan di halaman dosen pada website program studi.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardDosen;
