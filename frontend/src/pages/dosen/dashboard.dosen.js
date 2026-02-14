import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/Context";
import {
  getLecturersDetail,
  updateLecturerByEmail,
  uploadPhotoDosen,
} from "../../services/api";
import { useToast } from "../../context/toastProvider";
import { env } from "../../services/utils/env";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const DashboardDosen = () => {
  const user = useAuth().user;
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Image crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef(null);

  // State untuk form data
  const [payload, setPayload] = useState({
    username: "",
    fullname: "",
    expertise: [],
    matakuliah: [],
    email: "",
    kontak: "",
    externalLink: "",
    photo: "", // String path atau null
    isActive: true,
  });

  // State untuk input baru expertise dan matakuliah
  const [newExpertise, setNewExpertise] = useState("");
  const [newMatakuliah, setNewMatakuliah] = useState("");

  const fetchData = async () => {
    try {
      const data = await getLecturersDetail();
      console.log("Fetched lecturer data:", data);
      setPayload(data.data);
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
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddExpertise = () => {
    if (
      newExpertise.trim() &&
      !payload.expertise.includes(newExpertise.trim())
    ) {
      setPayload({
        ...payload,
        expertise: [...payload.expertise, newExpertise.trim()],
      });
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index) => {
    setPayload({
      ...payload,
      expertise: payload.expertise.filter((_, i) => i !== index),
    });
  };

  const handleAddMatakuliah = () => {
    if (
      newMatakuliah.trim() &&
      !payload.matakuliah.includes(newMatakuliah.trim())
    ) {
      setPayload({
        ...payload,
        matakuliah: [...payload.matakuliah, newMatakuliah.trim()],
      });
      setNewMatakuliah("");
    }
  };

  const handleRemoveMatakuliah = (index) => {
    setPayload({
      ...payload,
      matakuliah: payload.matakuliah.filter((_, i) => i !== index),
    });
  };

  // Validate image size (max 5MB)
  const validateImageSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error(
        `Ukuran file terlalu besar! Maksimal 5MB. Ukuran file Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (!validateImageSize(file)) {
        e.target.value = ""; // Reset input
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar!");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result);
        setShowCropModal(true);
        // Reset crop settings
        setScale(1);
        setRotate(0);
        setCrop({
          unit: "%",
          width: 90,
          aspect: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate cropped image and convert to File
  // Generate cropped image and convert to File (FIXED VERSION)
  const getCroppedImgAsFile = async () => {
    if (!completedCrop || !imgRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            reject(new Error("Failed to create blob from canvas"));
            return;
          }

          console.log("Blob created:", {
            size: blob.size,
            type: blob.type,
          });

          // IMPORTANT: Create File with ALL required properties
          const timestamp = Date.now();
          const fileName = `profile-photo-${timestamp}.jpg`;

          // Create File object from blob
          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: timestamp,
          });

          console.log("File created:", {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            isFile: file instanceof File,
            isBlob: file instanceof Blob,
          });

          // Create preview URL from blob
          const previewUrl = URL.createObjectURL(blob);

          resolve({ file, previewUrl });
        },
        "image/jpeg",
        0.95,
      );
    });
  };

  const handleCropSave = async () => {
    try {
      console.log("=== Starting crop save ===");

      const result = await getCroppedImgAsFile();

      if (!result || !result.file) {
        throw new Error("Failed to generate cropped image");
      }

      console.log("Crop result:", {
        hasFile: !!result.file,
        hasPreview: !!result.previewUrl,
        fileDetails: {
          name: result.file.name,
          size: result.file.size,
          type: result.file.type,
        },
      });

      setPreviewImage(result.previewUrl);

      // Store the File object in payload
      setPayload((prev) => ({ ...prev, photo: result.file }));

      setShowCropModal(false);
      toast.success("Foto berhasil dipotong!");
    } catch (error) {
      console.error("=== Error cropping image ===", error);
      toast.error("Gagal memotong foto! " + error.message);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImgSrc("");
    setCrop({
      unit: "%",
      width: 90,
      aspect: 1,
    });
    setScale(1);
    setRotate(0);
    // Reset file input
    const fileInput = document.getElementById("photo-upload");
    if (fileInput) fileInput.value = "";
  };

  // Helper function to get photo preview (same as AnnouncementModal)
  const getPhotoPreview = () => {
    if (!payload.photo) return null;

    // If it's a File object (new upload)
    if (payload.photo instanceof File) {
      return previewImage; // Use the preview URL we already created
    }

    // If it's a string (existing photo from backend)
    if (typeof payload.photo === "string") {
      // Check if it already has the full URL
      if (payload.photo.startsWith("http")) {
        return payload.photo;
      }
      // Otherwise, prepend the backend URL
      const path = `${env.IMAGE_BASE_URL}${payload.photo}`;
      console.log("PATH :", path);
      return path;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const email = user.email;
      let updatedPayload = { ...payload };

      // Upload photo if it's a File object
      if (payload.photo !== null && typeof payload.photo !== "string") {
        console.log("=== Starting photo upload process ===");

        // Validate that photo is actually a File object
        if (!(payload.photo instanceof File)) {
          console.error("Photo is not a File object:", payload.photo);
          toast.error("Format foto tidak valid. Silakan coba upload ulang.");
          setIsSaving(false);
          return;
        }

        console.log("Photo validation passed:", {
          name: payload.photo.name,
          size: payload.photo.size,
          type: payload.photo.type,
          lastModified: payload.photo.lastModified,
          constructor: payload.photo.constructor.name,
        });

        try {
          // PENTING: Kirim File object langsung, bukan FormData!
          // API service akan membuat FormData sendiri
          console.log("=== Calling uploadPhotoDosen API ===");
          const uploads = await uploadPhotoDosen(payload.photo); // ✅ Kirim File object

          console.log("=== Upload response ===", uploads);

          if (uploads.statusCode !== 200) {
            toast.error("Gagal menyimpan foto, coba lagi!");
            setIsSaving(false);
            return;
          }

          if (!uploads.data?.path) {
            throw new Error("Upload response missing photo path");
          }

          // Update payload with uploaded photo path
          updatedPayload = {
            ...payload,
            photo: uploads.data.path,
          };

          console.log("Photo uploaded successfully, path:", uploads.data.path);
          toast.success("Foto berhasil diunggah!");
        } catch (uploadError) {
          console.error("=== Photo upload failed ===");
          console.error("Error:", uploadError);
          console.error("Error response:", uploadError.response?.data);
          console.error("Error status:", uploadError.response?.status);

          toast.error(
            uploadError.response?.data?.message ||
              uploadError.message ||
              "Terjadi kesalahan saat menyimpan foto!",
          );
          setIsSaving(false);
          return;
        }
      } else {
        console.log("No new photo to upload, photo value:", payload.photo);
      }

      // Update lecturer profile
      console.log("=== Updating lecturer profile ===");
      console.log("Payload:", updatedPayload);

      const response = await updateLecturerByEmail(email, updatedPayload);
      console.log("=== Profile updated successfully ===", response);

      toast.success("Profil dosen berhasil diperbarui.");
      setIsEditing(false);
      setPreviewImage(null);

      // Clear file input
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) fileInput.value = "";

      fetchData();
    } catch (error) {
      console.error("=== Profile update failed ===");
      console.error("Error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message || error.message || "Terjadi kesalahan";
      toast.error(`Gagal memperbarui profil dosen. ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    fetchData(); // Reset form data
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section - SAMA */}
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
          {/* Action Buttons - SAMA */}
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
                      {getPhotoPreview() ? (
                        <img
                          src={getPhotoPreview()}
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                      Klik ikon kamera untuk mengunggah foto profil
                      <br />
                      <span className="text-red-500">Maksimal 5MB</span>
                    </p>
                  )}
                </div>

                {/* Rest of the form fields remain the same... */}
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
                        value={payload.username}
                        onChange={handleInputChange}
                        required
                        minLength={4}
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {payload.username}
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
                        value={payload.fullname}
                        onChange={handleInputChange}
                        required
                        minLength={4}
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {payload.fullname}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                      {payload.email}
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
                        value={payload.kontak}
                        onChange={handleInputChange}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {payload.kontak || "-"}
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
                        value={payload.externalLink}
                        onChange={handleInputChange}
                        placeholder="https://scholar.google.com/..."
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                        {payload.externalLink ? (
                          <a
                            href={payload.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline">
                            {payload.externalLink}
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
                        checked={payload.isActive}
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
                  {payload.expertise.length > 0 ? (
                    payload.expertise.map((item, index) => (
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
                  {payload.matakuliah.length > 0 ? (
                    payload.matakuliah.map((item, index) => (
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

      {/* Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Sesuaikan Foto Profil
                </h3>
                <button
                  onClick={handleCropCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg
                    className="w-6 h-6"
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
              </div>

              {/* Crop Controls */}
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom: {scale.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Crop Area */}
              <div className="flex justify-center mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop>
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxHeight: "400px",
                    }}
                  />
                </ReactCrop>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCropCancel}
                  className="px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Batal
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-6 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors shadow-sm">
                  Gunakan Foto Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDosen;
