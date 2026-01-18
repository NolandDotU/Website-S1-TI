import React, { useState, useEffect } from "react";
import NewsCard from "../components/announcement/NewsCard";
import MDEditor from "@uiw/react-md-editor";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  getAnnouncements,
  updateViewCount,
} from "../services/announcement/announcementAPI";
import { useToast } from "../context/toastProvider";
import { env } from "../services/utils/env";
import AnnouncementDetail from "../components/announcement/AnnouncementDetail";
import SearchBar from "../components/SearchBar";

const Berita = () => {
  const toast = useToast();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [limit] = useState(9); // 9 items per page for 3x3 grid

  const categories = [
    { value: "all", label: "Semua" },
    { value: "event", label: "Event" },
    { value: "lowongan", label: "Lowongan" },
    { value: "pengumuman", label: "Pengumuman" },
    { value: "alumni", label: "Alumni" },
  ];

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
      applyFilters(response.announcements, searchQuery, selectedCategory);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const applyFilters = (data, query, category) => {
    let filtered = data;

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((ann) => ann.category === category);
    }

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (ann) =>
          ann.title.toLowerCase().includes(lowerQuery) ||
          ann.content.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(announcements, "", selectedCategory);
      return;
    }

    try {
      const filtered = await getAnnouncements(1, 20, query);
      applyFilters(filtered.announcements, query, selectedCategory);
    } catch (error) {
      console.log(error);
      applyFilters(announcements, query, selectedCategory);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(announcements, searchQuery, category);
  };

  useEffect(() => {
    fetchAnnouncement(1);
  }, []);

  return (
    <>
      <section className="mx-auto w-full py-12 px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Berita
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Temukan berita, pengumuman, dan informasi terbaru seputar program
              studi dan kampus di halaman ini.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Cari berita atau pengumuman..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span>Kategori:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? "bg-blue-600 dark:bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search/Filter Results Info */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Menampilkan{" "}
              <span className="font-semibold">
                {filteredAnnouncements.length}
              </span>{" "}
              hasil
              {searchQuery && (
                <span>
                  {" "}
                  untuk "<span className="font-semibold">{searchQuery}</span>"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  dalam kategori{" "}
                  <span className="font-semibold">
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                  </span>
                </span>
              )}
              {filteredAnnouncements.length === 0 && (
                <span className="ml-2">
                  - Coba kata kunci atau kategori lain
                </span>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann) => (
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
                <div className="col-span-full text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tidak ada hasil ditemukan
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery || selectedCategory !== "all"
                      ? "Coba gunakan kata kunci atau kategori yang berbeda"
                      : "Tidak ada pengumuman tersedia"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination - Only show when not searching/filtering */}
            {!searchQuery && selectedCategory === "all" && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`min-w-[2.5rem] px-4 py-2 rounded-lg border transition font-medium ${
                            page === pageNumber
                              ? "bg-blue-600 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-600"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}>
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === page - 2 ||
                      pageNumber === page + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="px-2 text-gray-500 dark:text-gray-400">
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
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
