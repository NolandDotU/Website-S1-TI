import React, { useState, useEffect } from "react";
import { getLecturers } from "../services/lecturerAPI";
import LecturerCard from "../components/lecturers/LecturerCard";

const LecturerProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const itemsPerPage = 9;

  // Fetch lecturers from backend
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const response = await getLecturers(1, 100); // Fetch all lecturers
        console.log("Fetched lecturers data:", response);
        setLecturers(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching lecturers:", err);
        setError("Failed to load lecturers. Please try again later.");
        setLecturers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Extract unique expertise areas for filtering
  const expertiseAreas = [
    "All",
    "Machine Learning",
    "Web Programming",
    "Data Science",
    "Software Engineering",
    "Bahasa Inggris",
    "UI/UX Design",
  ];

  const handleCardOpen = (data) => {
    setSelectedLecturer(data);
  };

  // Filter lecturers based on search and expertise
  const filteredLecturers = Array.isArray(lecturers)
    ? lecturers.filter((lecturer) => {
        const matchesSearch =
          searchTerm === "" ||
          lecturer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(lecturer.expertise) &&
            lecturer.expertise
              .join(", ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        const matchesExpertise =
          selectedExpertise === "All" ||
          (Array.isArray(lecturer.expertise) &&
            lecturer.expertise.some((exp) =>
              exp.toLowerCase().includes(selectedExpertise.toLowerCase())
            ));

        return matchesSearch && matchesExpertise;
      })
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLecturers = filteredLecturers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setSelectedLecturer(null);
    setCurrentPage(1);
  }, [searchTerm, selectedExpertise]);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Daftar Profil Dosen
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Kenali para pengajar berkualitas di Program Studi Teknik Informatika
          UKSW
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Cari dosen berdasarkan nama atau keahlian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* Expertise Filter */}
          <div className="w-full md:w-auto">
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400">
              {expertiseAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-center md:text-left">
          Menampilkan {filteredLecturers.length} dari {lecturers.length} dosen
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Memuat data dosen...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      )}

      {/* Lecturer Cards Grid */}
      {!loading && !error && (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedLecturers.map((lecturer) => (
              <LecturerCard
                key={lecturer._id || lecturer.id}
                lecturer={lecturer}
                onClick={() => handleCardOpen(lecturer)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="max-w-7xl mx-auto mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "10px 20px",
                  backgroundColor: currentPage === 1 ? "#d1d5db" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}>
                ← Previous
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "10px 16px",
                        backgroundColor:
                          currentPage === page ? "#2563eb" : "#f3f4f6",
                        color: currentPage === page ? "white" : "#000000",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}>
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    currentPage === totalPages ? "#d1d5db" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results Message */}
      {!loading && !error && filteredLecturers.length === 0 && (
        <div className="text-center py-16">
          <svg
            className="mx-auto w-24 h-24 text-gray-400 dark:text-gray-600 mb-4"
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
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tidak ada dosen ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba ubah kata kunci pencarian atau filter yang digunakan
          </p>
        </div>
      )}
    </div>
  );
};

export default LecturerProfiles;
