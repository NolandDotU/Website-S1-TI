import React, { useEffect, useState } from 'react';
import { getHighlights } from '../services/api';

const TentangTISection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getHighlights();
        if (active) setItems(data);
      } catch (e) {
        setError('Gagal memuat data highlight');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="py-12" aria-labelledby="tentang-ti-heading">
      <h2 id="tentang-ti-heading" className="text-2xl font-bold mb-6">Tentang Teknik Informatika UKSW</h2>
      <div className="prose max-w-none mb-8 text-gray-700">
        <p>Program Studi Teknik Informatika UKSW berkomitmen menghasilkan lulusan yang siap menghadapi tantangan transformasi digital melalui fondasi akademik yang kuat dan pengalaman praktis.</p>
        <p>Fokus pengembangan meliputi kecerdasan buatan, rekayasa perangkat lunak, keamanan siber, komputasi awan, dan inovasi produk digital.</p>
      </div>
      {loading && <p className="text-sm text-gray-500">Memuat...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(h => (
            <div key={h.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">{h.title}</h3>
              <p className="text-sm text-gray-600">{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TentangTISection;
