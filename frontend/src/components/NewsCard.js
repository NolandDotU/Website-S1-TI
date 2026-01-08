import React from "react";

const NewsCard = ({ title, date, summary, image, onClick }) => {
  // Strip markdown formatting for clean text display
  const stripMarkdown = (text) => {
    return (
      text
        .replace(/#{1,6}\s+/g, "") // Remove headers
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.+?)\*/g, "$1") // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
        .replace(/`(.+?)`/g, "$1") // Remove inline code
        .replace(/\n+/g, " ") // Replace newlines with space
        .replace(/^\d+\.\s+/gm, "") // Remove numbered lists
        .replace(/^[-*+]\s+/gm, "") // Remove bullet points
        .trim()
        .substring(0, 150) + "..."
    ); // Limit length
  };

  return (
    <article
      onClick={onClick}
      className="group rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 bg-white p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row gap-5 cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e);
        }
      }}>
      {image && (
        <div className="relative flex-shrink-0 w-full md:w-56 h-40 md:h-36 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="text-xl font-semibold dark:text-white text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        <time className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wide mb-3">
          {date}
        </time>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
          {stripMarkdown(summary)}
        </p>
      </div>
    </article>
  );
};

export default NewsCard;
