import React from 'react';

const NewsEvents = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Berita & Acara</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Hub berita dan kalender acara kampus.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Berita Terbaru</h2>
        <p className="mt-2 text-sm text-slate-700">Rangkuman rilis terbaru dan sorotan kampus.</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Kalender Acara</h2>
        <p className="mt-2 text-sm text-slate-700">Jadwal seminar, wisuda, dan kegiatan komunitas.</p>
      </article>
    </div>
  </section>
);

export default NewsEvents;
