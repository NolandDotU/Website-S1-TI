import React, { useEffect } from "react";
import { motion } from "framer-motion";
import NewsCard from "./NewsCard";
import { getAnnouncements } from "../services/announcement/announcementAPI";
import { useToast } from "../context/toastProvider";
import { getAdapter } from "axios";
import { env } from "../services/utils/env";

const FeaturedNews = () => {
  const toast = useToast();
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getAnnouncements();
      console.log("response announcements", response);

      if (!response.announcements || response.announcements.length === 0) {
        setNews([]);
      } else {
        setNews(response.announcements);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError(true);
      toast.error("Terjadi kesalahan saat mengambil pengumuman!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare news items for display
  let displayNews = news.slice(0, 4);
  if (displayNews.length < 4) {
    displayNews = [...displayNews, ...Array(4 - displayNews.length).fill(null)];
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.8, ease: "easeInOut" },
        },
      }}
      className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
            },
          }}
          className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            Featured News
          </h2>
          <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
            Stay up-to-date with the latest research, student achievements, and
            campus events.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-8 lg:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={`loading-${index}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6 h-64 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Gagal Memuat Pengumuman
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Terjadi kesalahan saat mengambil data pengumuman.
            </p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="flex items-center justify-center w-full">
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 shadow-md  px-4 rounded-md w-full">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Belum Ada Pengumuman
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Pengumuman terbaru akan ditampilkan di sini.
              </p>
            </div>
          </div>
        )}

        {/* Success State with News */}
        {!loading && !error && news.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-2">
            {displayNews.map((item, index) => (
              <motion.div
                key={item ? item.id : `empty-${index}`}
                custom={index}
                variants={{
                  hidden: (i) => ({
                    opacity: 0,
                    x: i % 2 === 0 ? -50 : 50,
                  }),
                  visible: (i) => ({
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeOut",
                      delay: i * 0.3,
                    },
                  }),
                }}>
                {item ? (
                  <NewsCard
                    title={item.title}
                    date={new Date(item.publishDate).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    summary={item.content}
                    image={`${env.BACKEND_URL}${item.photo}`}
                    views={item.views}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 h-full min-h-[180px] flex items-center justify-center text-slate-400 dark:text-slate-500">
                    Berita belum tersedia
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedNews;
