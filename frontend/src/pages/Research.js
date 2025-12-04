import React from 'react';

const Research = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Riset</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Laboratorium, publikasi, dan inisiatif riset unggulan.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {['AI Lab', 'Software Engineering', 'Data Science'].map((l) => (
        <article key={l} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{l}</h2>
          <p className="mt-2 text-sm text-slate-700">Kolaborasi lintas bidang dan publikasi internasional.</p>
        </article>
      ))}
    </div>
  </section>
);

export default Research;
