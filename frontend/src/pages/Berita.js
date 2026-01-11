import React, { useState, useEffect } from "react";
import NewsCard from "../components/announcement/NewsCard";
import MDEditor from "@uiw/react-md-editor";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAnnouncements,
  updateViewCount,
} from "../services/announcement/announcementAPI";
import { useToast } from "../context/toastProvider";
import { env } from "../services/utils/env";
import AnnouncementDetail from "../components/announcement/AnnouncementDetail";

const Berita = () => {
  const toast = useToast();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(9); // 9 items per page for 3x3 grid

  const increamentView = async (id) => {
    try {
      const response = await updateViewCount(id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickAnnouncement = (announcement) => {
    increamentView(announcement.id);
    setSelectedAnnouncement(announcement);
    console.log("parameter ann : ", announcement);
  };

  const fetchAnnouncement = async (currentPage = 1) => {
    setLoading(true);
    try {
      console.log("Fetching announcements...");
      const response = await getAnnouncements(currentPage, limit);
      console.log("response", response);

      setAnnouncements(response.announcements);
      setTotalPages(response.meta.totalPage);
      setPage(response.meta.page);
    } catch (error) {
      toast.error(`Terjadi kesalahan! (${error.response?.data?.message})`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAnnouncement(newPage);
      // Scroll to top of the section
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  useEffect(() => {
    fetchAnnouncement(1);
  }, []);

  return (
    <>
      <section className="mx-auto w-full py-12 px-12">
        <h1 className="text-3xl font-bold">Berita</h1>
        <p className="mt-4 text-slate-700 max-w-3xl dark:text-slate-400">
          Temukan berita, pengumuman, dan informasi terbaru seputar program
          studi dan kampus di halaman ini.
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto">
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Announcements Grid */}
            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <NewsCard
                    key={ann.id}
                    title={ann.title}
                    date={new Date(ann.publishDate).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    summary={ann.content}
                    image={`${env.BACKEND_URL}${ann.photo}`}
                    views={ann.views}
                    onClick={() => onClickAnnouncement(ann)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada pengumuman tersedia
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            page === pageNumber
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}>
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === page - 2 ||
                      pageNumber === page + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal Popup */}
      {selectedAnnouncement !== null && (
        <AnnouncementDetail
          onClose={() => setSelectedAnnouncement(null)}
          data={selectedAnnouncement}
        />
      )}
    </>
  );
};

export default Berita;
