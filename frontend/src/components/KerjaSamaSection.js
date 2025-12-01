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
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-nowrap items-center justify-center gap-28 py-4">
            {items.map(p => (
              <div key={p.id} className="group flex items-center justify-center flex-shrink-0">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-16 sm:h-20 w-auto object-contain transition-all duration-500"
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
