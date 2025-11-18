import React, { useEffect, useState } from 'react';
import { getServices } from '../services/api';

const LayananKampusSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getServices();
        if (active) setItems(data);
      } catch (e) {
        setError('Gagal memuat layanan kampus');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="py-12" aria-labelledby="layanan-kampus-heading">
      <h2 id="layanan-kampus-heading" className="text-2xl font-bold mb-6">Layanan Kampus</h2>
      {loading && <p className="text-sm text-gray-500">Memuat...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(s => (
            <div key={s.id} className="relative rounded-2xl p-6 bg-white border border-gray-200 shadow hover:shadow-xl transition group overflow-hidden">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${s.color} blur-sm`} />
              <div className="relative z-10">
                <h3 className="font-semibold mb-2">{s.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.desc}</p>
                <button className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 group-hover:bg-black/20 backdrop-blur text-gray-700 group-hover:text-white transition">Kunjungi</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LayananKampusSection;
