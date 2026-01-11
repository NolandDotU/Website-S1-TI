import React from "react";
import { X } from "lucide-react";

const LecturerDetail = ({ lecturer, OnClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 "
      onClick={OnClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={OnClose}
          className="sticky top-4 float-right mr-4 mt-4 p-2 rounded-full dark:text-white dark:bg-gray-500 bg-gray-200 hover:bg-gray-300 transition z-10">
          <X className="w-6 h-6" />
        </button>

        {lecturer.photo && (
          <img src={lecturer.photo} alt={lecturer.fullname} className="" />
        )}

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
            {lecturer.title}
          </h2>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetail;
