import React, { useEffect, useState } from "react";
import { getPartners } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAllPartner } from "../services/partner.service";
import { env } from "../services/utils/env";

const KerjaSamaSection = ({ isAdmin = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getAllPartner();
        if (active) setItems(data.data || []);
      } catch (e) {
        setError("Gagal memuat data kerjasama");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Duplikasi data jika kurang dari 6 untuk smooth looping
  const displayItems = React.useMemo(() => {
    if (items.length === 0) return [];
    if (items.length >= 6) return items;

    const duplicated = [...items];
    while (duplicated.length < 6) {
      duplicated.push(...items);
    }
    return duplicated;
  }, [items]);

  return (
    <section className="py-12 px-4" aria-labelledby="kerjasama-heading">
      {!isAdmin && (
        <h2
          id="kerjasama-heading"
          className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Kerja Sama
        </h2>
      )}

      {loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat...</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {items.length === 0 && !loading && !error && (
        <div className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-800 "></div>
      )}

      {!loading && !error && (
        <>
          <div className="mx-auto max-w-7xl px-2">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet custom-bullet",
                bulletActiveClass:
                  "swiper-pagination-bullet-active custom-bullet-active",
              }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              aria-label="Carousel mitra kerja sama"
              className="py-4">
              {displayItems.map((p, index) => (
                <SwiperSlide
                  key={`${p.id}-${index}`}
                  className="flex items-center justify-center">
                  <div className="h-24 sm:h-28 md:h-32 w-56 md:w-64 flex items-center justify-center">
                    <img
                      src={env.BACKEND_URL + p.image}
                      alt={p.company}
                      className="max-h-full max-w-full object-contain origin-center transition-all duration-500"
                      style={{ transform: `scale(${p.scale || 1})` }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <style>{`
            .custom-bullet {
              background: #000000;
              width: 14px;
              height: 14px;
              margin: 2px 6px !important;
              opacity: 1;
              border-radius: 50%;
              border: 2px solid #ffffff;
              transition: background 0.3s, border 0.3s;
            }
            .custom-bullet-active {
              background: #ffffff;
              width: 25px;
              border-radius: 9999px;
              border-color: #000000;
              transition: background 0.3s, border 0.3s;
            }
            .swiper-pagination {
              margin-top: 50px;
              position: relative;
              z-index: 10;
            }
          `}</style>
        </>
      )}
    </section>
  );
};

export default KerjaSamaSection;
