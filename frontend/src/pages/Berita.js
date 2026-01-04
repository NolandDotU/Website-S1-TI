
import React, { useState } from 'react';
import NewsCard from '../components/NewsCard';
import MDEditor from '@uiw/react-md-editor';
import { X, Calendar, User, Tag, Clock } from 'lucide-react';
// import news from '../data/news';
// Use mockAnnouncement from previewAnnoucement.js
const mockAnnouncement = {
  title: "Pendaftaran Mahasiswa Baru Tahun Akademik 2025/2026",
  content: `## Informasi Pendaftaran\n\nUniversitas membuka pendaftaran mahasiswa baru untuk tahun akademik 2025/2026.\n\n### Jadwal Penting:\n- **Pendaftaran Online**: 1 Februari - 31 Maret 2025\n- **Ujian Masuk**: 10-15 April 2025\n- **Pengumuman Hasil**: 25 April 2025\n\n### Persyaratan:\n1. Lulusan SMA/SMK/MA sederajat\n2. Nilai rata-rata minimal 7.0\n3. Surat rekomendasi dari sekolah\n4. Dokumen identitas lengkap\n\nUntuk informasi lebih lanjut, silakan kunjungi website resmi kami atau hubungi bagian admisi.`,
  category: "pengumuman",
  photo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
  status: "published",
  author: "Admin Akademik",
  publishedAt: "2025-01-02T10:30:00",
  views: 1234,
};

const Berita = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const getCategoryColor = (category) => {
    const colors = {
      pengumuman: "bg-blue-100 text-blue-700",
      event: "bg-purple-100 text-purple-700",
      lowongan: "bg-green-100 text-green-700",
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

  return (
    <>
      <section className="mx-auto w-full py-12 px-12">
        <h1 className="text-3xl font-bold">Berita</h1>
        <p className="mt-4 text-slate-700 max-w-3xl">Temukan berita, pengumuman, dan informasi terbaru seputar program studi dan kampus di halaman ini.</p>
        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          <NewsCard
            title={mockAnnouncement.title}
            date={new Date(mockAnnouncement.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            summary={mockAnnouncement.content}
            image={mockAnnouncement.photo}
            onClick={() => setSelectedAnnouncement(mockAnnouncement)}
          />
        </div>
      </section>

      {/* Modal Popup */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="sticky top-4 float-right mr-4 mt-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            {selectedAnnouncement.photo && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={selectedAnnouncement.photo}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedAnnouncement.category)}`}>
                    <Tag className="w-4 h-4" />
                    {getCategoryLabel(selectedAnnouncement.category)}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedAnnouncement.title}</h2>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 mb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{selectedAnnouncement.author || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(selectedAnnouncement.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{selectedAnnouncement.views} views</span>
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-lg max-w-none">
                <MDEditor.Markdown
                  source={selectedAnnouncement.content}
                  style={{ backgroundColor: 'transparent', color: 'inherit' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Berita;
