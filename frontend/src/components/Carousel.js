import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "../assets/image.png";
import { env } from "../services/utils/env";

// Your images - add more image imports as needed
const defaultSlides = [
  {
    id: 1,
    img: image1,
    label: "Fakultas Teknologi Informasi",
    subtitle: "Membangun Masa Depan Digital",
  },
  {
    id: 2,
    img: image1,
    label: "Inovasi & Riset",
    subtitle: "Mendorong Transformasi Teknologi",
  },
  {
    id: 3,
    img: image1,
    label: "Berdiri Sejak 2003",
    subtitle: "Program Studi S1 Teknik Informatika",
  },
];

const Carousel = ({ slides = defaultSlides, autoPlayInterval = 5000 }) => {
  const BACKEND_URL = env.BACKEND_URL;
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const goTo = (i) => setIndex(i);

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
          ,
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0">
              <img
                src={slides[index].img}
                alt={slides[index].label}
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
                    className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-2xl">
                    {slides[index].label}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-white/90 text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg">
                    {slides[index].subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full origin-left"
                  />
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
