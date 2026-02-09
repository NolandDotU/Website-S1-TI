import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "../assets/image.png";
import { env } from "../services/utils/env";

const defaultSlides = [
  {
    _id: "1",
    type: "default",
    customContent: {
      title: "S1 Teknik Informatika",
      description: "Membangun Masa Depan Digital",
      imageUrl: image1,
      link: "",
    },
    order: 1,
    isActive: true,
  },
];

const Carousel = ({ slides = defaultSlides, autoPlayInterval = 5000 }) => {
  const BACKEND_URL = env.IMAGE_BASE_URL;
  const [index, setIndex] = useState(0);

  const activeSlides = slides.filter((slide) => slide.isActive !== false);
  const finalSlides =
    !activeSlides || activeSlides.length === 0 ? defaultSlides : activeSlides;
  const count = finalSlides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const goTo = (i) => setIndex(i);

  const getImageUrl = (slide) => {
    // Safe check untuk slide
    if (!slide) return image1;

    if (slide?.type === "custom") {
      const imageUrl = slide.customContent?.imageUrl;
      return imageUrl ? `${BACKEND_URL}${imageUrl}` : image1;
    }
    if (slide?.type === "announcement" && slide.announcementId) {
      const photo = slide.announcementId.photo;
      if (photo) {
        return `${BACKEND_URL}${photo}`;
      }
    }
    return image1;
  };

  const getTitle = (slide) => {
    // Safe check untuk slide
    if (!slide) return "";

    if (slide.type === "custom" || slide.type === "default") {
      return slide.customContent?.title || "";
    }
    if (slide.type === "announcement" && slide.announcementId) {
      return slide.announcementId.title || "";
    }
    return "";
  };

  const getDescription = (slide) => {
    // Safe check untuk slide
    if (!slide) return "";

    if (slide.type === "custom" || slide.type === "default") {
      return slide.customContent?.description || "";
    }
    if (slide.type === "announcement" && slide.announcementId) {
      const content = slide.announcementId.content || "";
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    }
    return "";
  };

  const getLink = (slide) => {
    // Safe check untuk slide
    if (!slide) return null;

    if (slide.type === "custom" || slide.type === "default") {
      return slide.customContent?.link || null;
    }
    if (slide.type === "announcement" && slide.announcementId) {
      return `/berita`;
    }
    return null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, autoPlayInterval);
    if (count <= 0) {
      return (
        <div className="w-full max-w-full mx-auto py-8 px-4">
          <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center px-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
                  Belum Ada Slide
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-gray-500 text-lg">
                  Saat ini tidak ada slide yang tersedia untuk ditampilkan
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      );
    }

    return () => clearInterval(timer);
  }, [index, autoPlayInterval]);

  // Empty state component
  if (count <= 0) {
    return (
      <div className="w-full max-w-full mx-auto py-8 px-4">
        <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
                Belum Ada Slide
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-500 text-lg">
                Saat ini tidak ada slide yang tersedia untuk ditampilkan
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto py-8 px-4">
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-2xl overflow-hidden">
        {/* Full Width Viewport */}
        <div className="overflow-hidden h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0">
              <img
                src={getImageUrl(finalSlides[index])}
                alt={getTitle(finalSlides[index])}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-20">
                <div className="max-w-7xl mx-auto">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 drop-shadow-2xl">
                    {getTitle(finalSlides[index])}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-white/90 text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg">
                    {getDescription(finalSlides[index])}
                  </motion.p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full origin-left"
                  />
                  {/* Optional: Add link button if link exists */}
                  {getLink(finalSlides[index]) && (
                    <motion.a
                      href={getLink(finalSlides[index])}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="inline-block mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg text-sm transition-all hover:scale-105">
                      Selengkapnya →
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Only show if more than 1 slide */}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-4 transition-all hover:scale-110 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-4 transition-all hover:scale-110 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 1 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {finalSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group relative">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-12 bg-white"
                        : "w-8 bg-white/50 hover:bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
