import React, { useState } from "react";
import Carousel from "../../../components/Carousel";

const HighlightManage = () => {
  const [carousel, setCarousel] = useState([]);
  const [announcement, setAnnouncement] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [announLoading, setAnnounLoading] = useState;
  return (
    <div className="flex flex-col p-4 justify-center items-center bg-white shadow-lg dark:bg-gray-800">
      <section className="w-full flex flex-col items-start">
        <h1>Highlight Preview</h1>
        <Carousel slides={carousel} />
      </section>

      <section>
        <div className="w-full overflow-x-scroll swiper-scrollbar-disabled flex items-center justify-start">
          {announcement.length > 0 ? (
            announcement.map((item) => {})
          ) : (
            <p className="text-slate-500 col-span-full">
              Belum ada pengumuman terbaru.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HighlightManage;
