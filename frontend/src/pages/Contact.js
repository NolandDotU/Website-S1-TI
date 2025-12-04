import React from 'react';

const Contact = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Kontak</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Hubungi kami melalui formulir atau kunjungi kampus.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Formulir Kontak</h2>
        <form className="mt-2 space-y-3" aria-label="Formulir Kontak">
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Nama" aria-label="Nama" />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Email" aria-label="Email" />
          <textarea className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Pesan" rows={4} aria-label="Pesan"></textarea>
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-white">Kirim</button>
        </form>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Lokasi</h2>
        <div className="mt-2 aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
          <span className="text-slate-500">Map Placeholder</span>
        </div>
      </article>
    </div>
  </section>
);

export default Contact;
