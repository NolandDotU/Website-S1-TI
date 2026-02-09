import React, { useState, useEffect } from "react";
import { useToast } from "../../../context/toastProvider";
import { Calendar, User, Tag, Clock, Eye } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { getById } from "../../../services/announcement/announcementAPI";
import { useParams } from "react-router-dom";
import { env } from "../../../services/utils/env";

const mockAnnouncement = {
  title: "Pendaftaran Mahasiswa Baru Tahun Akademik 2025/2026",
  content: `## Informasi Pendaftaran

Universitas membuka pendaftaran mahasiswa baru untuk tahun akademik 2025/2026.

### Jadwal Penting:
- **Pendaftaran Online**: 1 Februari - 31 Maret 2025
- **Ujian Masuk**: 10-15 April 2025
- **Pengumuman Hasil**: 25 April 2025

### Persyaratan:
1. Lulusan SMA/SMK/MA sederajat
2. Nilai rata-rata minimal 7.0
3. Surat rekomendasi dari sekolah
4. Dokumen identitas lengkap

Untuk informasi lebih lanjut, silakan kunjungi website resmi kami atau hubungi bagian admisi.`,
  category: "pengumuman",
  photo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
  status: "published",
  author: "Admin Akademik",
  publishedAt: "2025-01-02T10:30:00",
  views: 1234,
};

const PreviewAnnouncement = () => {
  const toast = useToast();
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(mockAnnouncement);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    getAnnoucement();
  }, [id]);

  const getAnnoucement = async () => {
    try {
      const response = await getById(id);
      console.log("API response for getAnnoucement:", response);
      if (response.statusCode !== 200) {
        toast.error(response.message);
      }
      setAnnouncement(response.data);
      setPhotoUrl(env.IMAGE_BASE_URL + response.data.photo);
    } catch (error) {
      console.error("Error fetching announcement:", error);
      toast.error("Failed to fetch announcement");
    }
  };
  const getCategoryColor = (category) => {
    const colors = {
      pengumuman:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
      event:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
      lowongan:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    };
    return colors[category] || colors.pengumuman;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      pengumuman: "Pengumuman",
      event: "Event",
      lowongan: "Lowongan",
    };
    return labels[category] || "Pengumuman";
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    if (dateString === null) {
      const date = new Date();
      return date.toLocaleDateString("id-ID", options);
    }
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Image */}
      {announcement.photo && (
        <div className="relative h-96 w-full overflow-hidden">
          <img
            src={photoUrl}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-6 left-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(
                announcement.category,
              )}`}>
              <Tag className="w-4 h-4" />
              {getCategoryLabel(announcement.category)}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {announcement.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">
                    {announcement.author || "Admin"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">
                    {formatDate(announcement.publishedAt | Date.now())}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">{announcement.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {/* If no photo, show title here */}
          {!announcement.photo && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(
                    announcement.category,
                  )}`}>
                  <Tag className="w-4 h-4" />
                  {getCategoryLabel(announcement.category)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {announcement.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{announcement.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">
                    {formatDate(announcement.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">{announcement.views} views</span>
                </div>
              </div>
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDEditor.Markdown
              source={announcement.content}
              style={{
                backgroundColor: "transparent",
                color: "inherit",
              }}
            />
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition font-medium">
            ← Kembali ke Daftar Pengumuman
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewAnnouncement;
