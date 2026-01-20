import React from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Tag, Check } from "lucide-react";
import { env } from "../../../services/utils/env";

const SlideListAnnouncement = ({
  data,
  onCarousel,
  onAddToCarousel,
  loading = false,
}) => {
  const BACKEND_URL = env.BACKEND_URL;

  const getCategoryColor = (category) => {
    const colors = {
      event:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      lowongan:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      pengumuman:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const getCategoryLabel = (category) => {
    const labels = {
      event: "Event",
      lowongan: "Lowongan",
      pengumuman: "Pengumuman",
    };
    return labels[category] || category;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Daftar Pengumuman
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[320px] bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Daftar Pengumuman
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada pengumuman tersedia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Tambah pengumuman ke highlight
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data.length} pengumuman
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {data.map((item, index) => (
          <motion.div
            key={item._id || item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[320px] bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
            {/* Image */}
            <div className="relative h-40 bg-gray-200 dark:bg-gray-600 overflow-hidden">
              {item.photo ? (
                <img
                  src={
                    item.photo.startsWith("http")
                      ? item.photo
                      : `${BACKEND_URL}${item.photo}`
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                    item.category,
                  )}`}>
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              {/* Add to Carousel Button */}
              {!onCarousel.some(
                (c) => c.announcementId?.id === (item._id || item.id),
              ) ? (
                <button
                  onClick={() => onAddToCarousel(item)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 
      hover:bg-blue-600 hover:text-white rounded-full shadow-md 
      transition-all opacity-0 group-hover:opacity-100"
                  title="Tambah ke Carousel">
                  <Plus className="w-5 h-5" />
                </button>
              ) : (
                <div
                  className="absolute top-3 right-3 p-2 bg-green-600/90 dark:bg-green-800/90 
      hover:bg-green-800 dark:hover:bg-green-600 rounded-full shadow-md text-white
      transition-all">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {truncateText(item.content)}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                {item.publishDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.publishDate)}</span>
                  </div>
                )}
                <span
                  className={`px-2 py-1 rounded ${
                    item.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : item.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                  }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SlideListAnnouncement;
