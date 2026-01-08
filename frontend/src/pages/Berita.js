import React, { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import MDEditor from "@uiw/react-md-editor";
import { X, Calendar, User, Tag, Clock } from "lucide-react";
import { getAnnouncements } from "../services/announcement/announcementAPI";
import { useToast } from "../context/toastProvider";
import { env } from "../services/utils/env";

const Berita = () => {
  const toast = useToast();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncement = async () => {
    setLoading(true);
    try {
      console.log("Fetching announcements...");
      const response = await getAnnouncements();
      console.log("response", response);
      setAnnouncements(response.announcements);
      console.log(announcements);
      setLoading(false);
    } catch (error) {
      toast.error(`Terjadi kesalahan! (${error.response?.data?.message})`);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <>
      <section className="mx-auto w-full py-12 px-12">
        <h1 className="text-3xl font-bold">Berita</h1>
        <p className="mt-4 text-slate-700 max-w-3xl dark:text-slate-400">
          Temukan berita, pengumuman, dan informasi terbaru seputar program
          studi dan kampus di halaman ini.
        </p>
        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {announcements.map((ann) => (
            <NewsCard
              title={ann.title}
              date={new Date(ann.publishDate).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              summary={ann.content}
              image={`${env.BACKEND_URL}${ann.photo}`}
              onClick={() => setSelectedAnnouncement(ann)}
            />
          ))}
        </div>
      </section>

      {/* Modal Popup */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 "
          onClick={() => setSelectedAnnouncement(null)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="sticky top-4 float-right mr-4 mt-4 p-2 rounded-full dark:text-white dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 transition z-10">
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            {selectedAnnouncement.photo && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={env.BACKEND_URL + selectedAnnouncement.photo}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
                      selectedAnnouncement.category
                    )}`}>
                    <Tag className="w-4 h-4" />
                    {getCategoryLabel(selectedAnnouncement.category)}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
                {selectedAnnouncement.title}
              </h2>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedAnnouncement.author || "Admin"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(
                      selectedAnnouncement.publishDate
                    ).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedAnnouncement.views} views
                  </span>
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-lg max-w-none">
                <MDEditor.Markdown
                  source={selectedAnnouncement.content}
                  style={{ backgroundColor: "transparent", color: "inherit" }}
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
