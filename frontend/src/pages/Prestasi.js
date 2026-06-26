import React, { useState, useEffect, useCallback } from "react";
import AchievementCard from "../components/achievement/AchievementCard";
import AchievementDetail from "../components/achievement/AchievementDetail";
import { Filter, Award } from "lucide-react";
import { getAchievements } from "../services/api";
import { useToast } from "../context/toastProvider";
import { env } from "../services/utils/env";
import SearchBar from "../components/SearchBar";

const Prestasi = () => {
  const toast = useToast();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [limit] = useState(9);

  const categories = [
    { value: "all", label: "Semua" },
    { value: "Mahasiswa", label: "Mahasiswa" },
    { value: "Dosen", label: "Dosen" },
    { value: "Program Studi", label: "Program Studi" },
    { value: "Alumni", label: "Alumni" },
    { value: "Organisasi", label: "Organisasi" },
  ];

  const fetchAchievements = async (currentPage = 1, query = "") => {
    setLoading(true);
    try {
      const response = await getAchievements(
        currentPage,
        query ? 100 : limit,
        query
      );

      if (currentPage === 1) {
        setAchievements(response.data.achievements || []);
      } else {
        setAchievements((prev) => [...prev, ...(response.data.achievements || [])]);
      }
      setTotalPages(response.data.meta?.totalPage || 1);
      setPage(response.data.meta?.page || 1);

      applyFilters(response.data.achievements || [], query, selectedCategory);
    } catch (error) {
      toast.error(`Terjadi kesalahan saat memuat prestasi!`);
      setAchievements([]);
      setFilteredAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchAchievements(newPage, searchQuery);
    }
  };

  const applyFilters = useCallback((data, query, category) => {
    let filtered = [...data];

    if (category !== "all") {
      filtered = filtered.filter((ann) => ann.category === category);
    }

    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase().trim();
      filtered = filtered.filter(
        (ann) =>
          ann.title?.toLowerCase().includes(lowerQuery) ||
          ann.recipient?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredAchievements(filtered);
  }, []);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      setPage(1);

      if (!query || !query.trim()) {
        fetchAchievements(1, "");
        return;
      }
      fetchAchievements(1, query);
    },
    [selectedCategory]
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    applyFilters(achievements, searchQuery, category);
  };

  useEffect(() => {
    fetchAchievements(1);
  }, []);

  useEffect(() => {
    applyFilters(achievements, searchQuery, selectedCategory);
  }, [achievements, searchQuery, selectedCategory, applyFilters]);

  const isFiltering = searchQuery.trim() || selectedCategory !== "all";

  return (
    <>
      <section className="mx-auto w-full py-10 sm:py-12 px-4 sm:px-6 md:px-12 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Award className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
              Daftar Prestasi
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Raihan prestasi mahasiswa, dosen, alumni, dan program studi yang membanggakan.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Cari nama atau judul..." />
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
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search/Filter Results Info */}
        {isFiltering && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Menampilkan <span className="font-semibold">{filteredAchievements.length}</span> hasil
              {searchQuery && <span> untuk "<span className="font-semibold">{searchQuery}</span>"</span>}
              {selectedCategory !== "all" && (
                <span> dalam kategori <span className="font-semibold">{categories.find((c) => c.value === selectedCategory)?.label}</span></span>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && achievements.length === 0 ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse h-80">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((item) => (
                  <AchievementCard
                    key={item.id}
                    title={item.title}
                    recipient={item.recipient}
                    category={item.category}
                    level={item.level}
                    date={new Date(item.achievementDate).toLocaleDateString("id-ID", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                    image={item.image ? `${env.IMAGE_BASE_URL}${item.image}` : null}
                    onClick={() => setSelectedAchievement(item)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tidak ada hasil ditemukan
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coba gunakan kata kunci atau kategori yang berbeda.
                  </p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {!isFiltering && page < totalPages && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal Popup */}
      {selectedAchievement && (
        <AchievementDetail
          data={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
};

export default Prestasi;
