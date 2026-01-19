import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  bgColor,
  iconColor,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {value.toLocaleString()}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
        {trend && (
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
            <span>{trendValue}% dari bulan lalu</span>
          </div>
        )}
      </div>
      <div
        className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
    </div>
  </motion.div>
);
