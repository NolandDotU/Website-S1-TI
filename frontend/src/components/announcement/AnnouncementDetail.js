import React, { useDebugValue, useEffect } from "react";
import { X, Calendar, User, Tag, Eye } from "lucide-react";
import { env } from "../../services/utils/env";
import MDEditor from "@uiw/react-md-editor";

const AnnouncementDetail = ({ onClose, data }) => {
  useEffect(() => {
    if (data === null) {
      console.error("Data is null");
      return;
    }
    console.log("Data:", data);
  }, [data]);
  const getCategoryColor = (category) => {
    const colors = {
      pengumuman: "bg-blue-100 text-blue-700",
      event: "bg-purple-100 text-purple-700",
      lowongan: "bg-green-100 text-green-700",
    };
    return colors[category] || colors.pengumuman;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      pengumuman: "Pengumuman",
      event: "Event",
      lowongan: "Lowongan",
    };
    return labels[category] || "Pengumuman";
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 "
      onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 mt-4 p-2 rounded-full dark:text-white dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 transition z-10">
          <X className="w-6 h-6" />
        </button>

        {data.photo && (
          <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
            <img
              src={env.IMAGE_BASE_URL + data.photo}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
                  data.category,
                )}`}>
                <Tag className="w-4 h-4" />
                {getCategoryLabel(data.category)}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
            {data.title}
          </h2>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{data.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(data.publishDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{data.views} views</span>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none">
            <MDEditor.Markdown
              source={data.content}
              style={{ backgroundColor: "transparent", color: "inherit" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
