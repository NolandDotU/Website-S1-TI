
import React from 'react';
import news from '../data/news';
import NewsCard from '../components/NewsCard';

const Berita = () => (
  <section className="mx-auto w-full py-12 px-12">
    <h1 className="text-3xl font-bold">Berita</h1>
    <p className="mt-4 text-slate-700 max-w-3xl">Temukan berita, pengumuman, dan informasi terbaru seputar program studi dan kampus di halaman ini.</p>
    <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto">
      {news && news.length > 0 ? (
        news.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            date={new Date(item.uploadDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            summary={item.content}
            image={item.photo}
          />
        ))
      ) : (
        <p className="text-slate-500 col-span-full">Belum ada berita terbaru.</p>
      )}
    </div>
  </section>
);

export default Berita;
