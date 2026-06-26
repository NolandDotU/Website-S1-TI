import React from "react";
import { Award, User, Calendar } from "lucide-react";

const AchievementCard = ({ title, recipient, category, level, date, image, onClick }) => {
  return (
    <div
      className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
        {image && image !== "null" ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <Award className="w-16 h-16 text-blue-200 dark:text-gray-600" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full shadow-sm">
            {level}
          </span>
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full shadow-sm w-max">
            {category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{recipient}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
