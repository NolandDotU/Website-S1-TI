import React, { useState, useEffect } from "react";
import { useToast } from "../../../context/toastProvider";
import { Calendar, User, Tag, Clock } from "lucide-react";
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
      setPhotoUrl(env.BACKEND_URL + "/" + response.data.photo);
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
                announcement.category
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
                  <Clock className="w-5 h-5" />
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
                    announcement.category
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
                  <Clock className="w-5 h-5" />
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

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bagikan pengumuman ini:
              </p>
              <div className="flex gap-3">
                <button className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 transition">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-3 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-900 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-200 transition">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="p-3 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 transition">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
              </div>
            </div>
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
