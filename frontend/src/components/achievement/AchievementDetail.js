import React from "react";
import { X, Calendar, User, Trophy, Download } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { env } from "../../services/utils/env";

const AchievementDetail = ({ data, onClose }) => {
  if (!data) return null;

  const imageUrl = data.image ? `${env.IMAGE_BASE_URL}${data.image}` : null;
  const certUrl = data.certificate ? `${env.IMAGE_BASE_URL}${data.certificate}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image Background */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-gray-100 dark:bg-gray-900">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={data.title} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
              <Trophy className="w-24 h-24 text-white/50" />
            </div>
          )}
          
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badges overlaid on image */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                {data.level}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold rounded-full shadow-sm">
                {data.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {data.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Penerima</p>
                <p className="font-semibold">{data.recipient}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tanggal Diperoleh</p>
                <p className="font-semibold">
                  {new Date(data.achievementDate).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
            </div>

            {data.organizer && (
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Penyelenggara</p>
                  <p className="font-semibold">{data.organizer}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {data.description && (
            <div className="prose prose-blue dark:prose-invert max-w-none mb-8" data-color-mode="light">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deskripsi</h3>
              <MDEditor.Markdown source={data.description} className="!bg-transparent !text-gray-700 dark:!text-gray-300" />
            </div>
          )}

          {/* Certificate Download */}
          {certUrl && (
            <div className="mt-8">
              <a 
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
              >
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Lihat/Unduh Sertifikat</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementDetail;
