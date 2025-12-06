import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { getLecturers } from '../services/api';

const LecturerProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lecturers from backend
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const data = await getLecturers();
        console.log('Fetched lecturers data:', data);
        // Ensure data is an array
        setLecturers(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
        setError('Failed to load lecturers. Please try again later.');
        setLecturers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Extract unique expertise areas for filtering
  const expertiseAreas = ['All', 'Machine Learning', 'Web Programming', 'Data Science', 'Software Engineering', 'Bahasa Inggris', 'UI/UX Design'];

  // Filter lecturers based on search and expertise
  const filteredLecturers = Array.isArray(lecturers) ? lecturers.filter(lecturer => {
    const matchesSearch = lecturer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecturer.expertise?.join(', ').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === 'All' || 
                            lecturer.expertise?.some(exp => exp.toLowerCase().includes(selectedExpertise.toLowerCase()));
    return matchesSearch && matchesExpertise;
  }) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-12">
      {/* Header Section */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Daftar Profil Dosen
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Kenali para pengajar berkualitas di Program Studi Teknik Informatika UKSW
        </p>
      </m.div>

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
                viewBox="0 0 24 24"
              >
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
              className="w-full md:w-64 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            >
              {expertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data dosen...</p>
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
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
        {console.log('About to render. Lecturers:', lecturers.length, 'Filtered:', filteredLecturers.length, 'Data:', filteredLecturers)}
        {filteredLecturers.map((lecturer) => {
          console.log('Mapping lecturer:', lecturer);
          return (
          <m.div
            key={lecturer.id}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:shadow-2xl"
          >
            {/* Profile Image */}
            <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex items-center justify-center">
              {lecturer.photo ? (
                <img
                  src={lecturer.photo}
                  alt={lecturer.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-white text-8xl">👨‍🏫</div>';
                  }}
                />
              ) : (
                <div className="text-white text-8xl">👨‍🏫</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Lecturer Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {lecturer.fullname}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Keahlian:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {lecturer.expertise.join(', ')}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <a
                  href={`mailto:${lecturer.email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {lecturer.email}
                </a>
                
                {lecturer.externalLink && (
                  <a
                    href={lecturer.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Profil Eksternal
                  </a>
                )}
              </div>

              {/* View Profile Button */}
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Lihat Profil Lengkap
              </button>
            </div>
          </m.div>
        );
        })}
        </m.div>
      )}

      {/* No Results Message */}
      {!loading && !error && filteredLecturers.length === 0 && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <svg className="mx-auto w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tidak ada dosen ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba ubah kata kunci pencarian atau filter yang digunakan
          </p>
        </m.div>
      )}
    </div>
  );
};

export default LecturerProfiles;
