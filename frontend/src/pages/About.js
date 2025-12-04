import React from 'react';

const About = () => (
  <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-bold">Tentang Kami</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Misi kami adalah mengembangkan pendidikan berkualitas, riset berpengaruh, dan pengabdian masyarakat. Sejarah panjang kami ditandai dengan inovasi dan kolaborasi lintas disiplin.</p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Misi</h2>
        <p className="mt-2 text-sm text-slate-700">Mencetak lulusan berintegritas dengan kompetensi global.</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Visi</h2>
        <p className="mt-2 text-sm text-slate-700">Menjadi pusat unggulan pendidikan dan riset teknologi.</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Kepemimpinan</h2>
        <p className="mt-2 text-sm text-slate-700">Dikelola oleh pimpinan yang berpengalaman dan visioner.</p>
      </article>
    </div>
  </section>
);

export default About;
