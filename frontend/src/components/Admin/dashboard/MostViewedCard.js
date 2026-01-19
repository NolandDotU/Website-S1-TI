import { motion } from "framer-motion";
import { Eye, Calendar } from "lucide-react";

export const MostViewedCard = ({ announcement }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
        rounded-xl shadow-lg p-6 text-white">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
        <Eye className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-100 mb-1">
          Pengumuman Terpopuler Bulan Ini
        </p>
        <h3 className="text-lg font-bold leading-tight">
          {announcement.title}
        </h3>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-white/20">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {announcement.views.toLocaleString()} views
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">
          {new Date(announcement.publishDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  </motion.div>
);
