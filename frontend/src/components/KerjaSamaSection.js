import React, { useEffect, useState } from 'react';
import { getPartners } from '../services/api';

const KerjaSamaSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPartners();
        if (active) setItems(data);
      } catch (e) {
        setError('Gagal memuat data kerjasama');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="py-12" aria-labelledby="kerjasama-heading">
      <h2 id="kerjasama-heading" className="text-2xl font-bold mb-6 text-center">Kerja Sama</h2>
      {loading && <p className="text-sm text-gray-500">Memuat...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-nowrap items-center gap-8 overflow-x-auto py-2">
            {items.map(p => (
              <div key={p.id} className="group rounded-xl p-6 transition flex items-center justify-center flex-shrink-0 w-48">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-20 sm:h-24 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default KerjaSamaSection;
