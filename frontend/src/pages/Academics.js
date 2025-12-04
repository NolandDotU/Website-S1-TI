import React from 'react';

const Academics = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Akademik</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Jelajahi program studi, departemen, dan fakultas unggulan kami.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Informatika', 'Sistem Informasi', 'Data Science'].map((p) => (
        <article key={p} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{p}</h2>
          <p className="mt-2 text-sm text-slate-700">Kurikulum terkini dan peluang riset.</p>
        </article>
      ))}
    </div>
  </section>
);

export default Academics;
