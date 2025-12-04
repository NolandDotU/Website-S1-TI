import React from 'react';

const Admissions = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Admissions</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Informasi penerimaan Sarjana dan Magister, termasuk persyaratan dan jadwal.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Sarjana (S1)</h2>
        <p className="mt-2 text-sm text-slate-700">Jalur reguler dan prestasi dengan seleksi yang transparan.</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Magister (S2)</h2>
        <p className="mt-2 text-sm text-slate-700">Program lanjutan untuk pengembangan karier dan riset.</p>
      </article>
    </div>
  </section>
);

export default Admissions;
