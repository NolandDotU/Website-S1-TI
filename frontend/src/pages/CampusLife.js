import React from 'react';

const CampusLife = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Campus Life</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Kehidupan kampus: housing, klub, olahraga, dan event.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Housing', 'Clubs', 'Sports'].map((t) => (
        <article key={t} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{t}</h2>
          <p className="mt-2 text-sm text-slate-700">Fasilitas dan komunitas yang inklusif.</p>
        </article>
      ))}
    </div>
  </section>
);

export default CampusLife;
