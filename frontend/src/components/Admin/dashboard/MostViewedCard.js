import { motion } from "framer-motion";
import { Eye, Calendar, TrendingUp, FileText } from "lucide-react";

export const MostViewedCard = ({ announcement }) => {
  // Null/Empty state handler
  if (!announcement) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 
          rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center  text-center">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Belum Ada Data
          </p>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Tidak ada pengumuman terpopuler bulan ini
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Pengumuman akan muncul setelah ada yang dipublikasikan
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
        rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Eye className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-100 mb-1">
            Pengumuman Terpopuler Bulan Ini
          </p>
          <h3 className="text-lg font-bold leading-tight line-clamp-2">
            {announcement.title || "Tanpa Judul"}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {announcement.views?.toLocaleString() || "0"} views
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {announcement.publishDate
              ? new Date(announcement.publishDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
