import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "../assets/image.png";
import { env } from "../services/utils/env";

// Default slides for fallback
const defaultSlides = [
  {
    _id: "1",
    type: "custom",
    customContent: {
      title: "Fakultas Teknologi Informasi",
      description: "Membangun Masa Depan Digital",
      imageUrl: image1,
    },
    order: 1,
    isActive: true,
  },
];

const Carousel = ({ slides = defaultSlides, autoPlayInterval = 5000 }) => {
  const BACKEND_URL = env.BACKEND_URL;
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const goTo = (i) => setIndex(i);

  // Helper function to get image URL
  const getImageUrl = (slide) => {
    if (slide.type === "custom") {
      // Check if imageUrl is a full URL or relative path
      const imageUrl = slide.customContent.imageUrl;
      return `${BACKEND_URL}/${imageUrl}`;
    }
    // ...existing code...
    // For announcement type
    if (slide.type === "announcement" && slide.announcementId) {
      const photo = slide.announcementId.photo;
      if (photo) {
        return `${BACKEND_URL}/${photo}`;
      }
    }
    return image1;
  };

  // Helper function to get title
  const getTitle = (slide) => {
    if (slide.type === "custom") {
      return slide.customContent.title;
    }
    if (slide.type === "announcement" && slide.announcementId) {
      return slide.announcementId.title;
    }
    return "";
  };

  // Helper function to get description
  const getDescription = (slide) => {
    if (slide.type === "custom") {
      return slide.customContent.description;
    }
    if (slide.type === "announcement" && slide.announcementId) {
      // Return first 200 chars of content as description
      const content = slide.announcementId.content;
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    }
    return "";
  };

  // Helper function to get link
  const getLink = (slide) => {
    if (slide.type === "custom") {
      return slide.customContent.link;
    }
    if (slide.type === "announcement" && slide.announcementId) {
      return slide.announcementId.link;
    }
    return null;
  };

  // Helper function to get category badge (for announcement)
  const getCategoryBadge = (slide) => {
    if (slide.type === "announcement" && slide.announcementId) {
      const categoryMap = {
        event: { label: "Event", color: "bg-purple-500" },
        lowongan: { label: "Lowongan", color: "bg-green-500" },
        pengumuman: { label: "Pengumuman", color: "bg-blue-500" },
      };
      return categoryMap[slide.announcementId.category] || null;
    }
    return null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [index, autoPlayInterval]);

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
                src={getImageUrl(slides[index])}
                alt={getTitle(slides[index])}
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
                  {/* Category Badge for Announcement */}
                  {getCategoryBadge(slides[index]) && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="mb-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold ${
                          getCategoryBadge(slides[index]).color
                        }`}>
                        {getCategoryBadge(slides[index]).label}
                      </span>
                    </motion.div>
                  )}

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-2xl">
                    {getTitle(slides[index])}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-white/90 text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg">
                    {getDescription(slides[index])}
                  </motion.p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full origin-left"
                  />
                  {/* Optional: Add link button if link exists */}
                  {getLink(slides[index]) && (
                    <motion.a
                      href={getLink(slides[index])}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="inline-block mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all hover:scale-105">
                      Selengkapnya →
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
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
          {slides.map((_, i) => (
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
      </div>
    </div>
  );
};

export default Carousel;
