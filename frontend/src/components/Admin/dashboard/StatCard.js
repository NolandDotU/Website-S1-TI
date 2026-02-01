import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export const StatCard = ({
  title = "Tidak ada judul",
  value = 0,
  subtitle,
  icon: Icon = BarChart3,
  trend,
  trendValue,
  bgColor = "bg-gray-100 dark:bg-gray-700",
  iconColor = "text-gray-600 dark:text-gray-400",
  isLoading = false,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="flex-1 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  // Parse value safely
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;
  const safeTrendValue =
    typeof trendValue === "number" ? trendValue : parseFloat(trendValue) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 h-full border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
            {numericValue.toLocaleString("id-ID")}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {subtitle}
            </p>
          )}
          {trend && safeTrendValue !== 0 && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {Math.abs(safeTrendValue).toFixed(1)}% dari bulan lalu
              </span>
            </div>
          )}
          {trend && safeTrendValue === 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="w-4 h-0.5 bg-gray-400 dark:bg-gray-500"></span>
              <span>Tidak ada perubahan</span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300 hover:scale-110`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
};
