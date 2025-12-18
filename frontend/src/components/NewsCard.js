import React from 'react';

const NewsCard = ({ title, date, summary, image }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow hover:shadow-md transition flex flex-col md:flex-row gap-4">
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full md:w-48 h-32 object-cover rounded-md"
      />
    )}
    <div className="flex flex-col flex-1">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>
      <span className="text-xs text-slate-500 mb-2">{date}</span>
      <p className="text-sm text-slate-700 flex-1">{summary}</p>
    </div>
  </article>
);

export default NewsCard;
