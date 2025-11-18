import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../services/api';

const PengumumanSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getAnnouncements();
        if (active) setItems(data);
      } catch (e) {
        setError('Gagal memuat pengumuman');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="py-12" aria-labelledby="pengumuman-heading">
      <h2 id="pengumuman-heading" className="text-2xl font-bold mb-6">Pengumuman</h2>
      {loading && <p className="text-sm text-gray-500">Memuat...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(a => (
            <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition">
              <p className="text-xs text-gray-500 mb-2">{a.date}</p>
              <h3 className="font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{a.excerpt}</p>
              <button className="text-sm font-medium text-blue-700 hover:underline">Selengkapnya →</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PengumumanSection;
