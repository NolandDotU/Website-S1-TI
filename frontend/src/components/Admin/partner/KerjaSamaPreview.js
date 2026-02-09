import React, { useState, useEffect, useRef } from "react";
import { env } from "../../../services/utils/env";

export const KerjaSamaPreview = ({ partners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  // Start auto-scroll
  useEffect(() => {
    if (!partners || partners.length === 0) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [partners?.length]); // Remove currentIndex dependency

  const handleNext = () => {
    if (!partners || partners.length === 0) return;

    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % partners.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (idx) => {
    if (isAnimating || !partners || partners.length === 0) return;

    // Pause auto-scroll temporarily
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsAnimating(false), 500);

    // Resume auto-scroll after 5 seconds
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }, 5000);
  };

  const getVisibleSlides = () => {
    if (!partners || partners.length === 0) return [];

    const slides = [];
    const slidesToShow = Math.min(5, partners.length);

    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % partners.length;
      slides.push(partners[index]);
    }

    return slides;
  };

  // Early return if no partners
  if (!partners || partners.length === 0) {
    return (
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-2">
          <div className="relative py-4">
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No partners to display
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const visibleSlides = getVisibleSlides();

  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-2">
        <div className="relative py-4">
          <div className="flex items-center justify-center gap-6 mb-8">
            {visibleSlides.map((partner, idx) => (
              <div
                key={`${partner.id}-${idx}`}
                className={`transition-all duration-500 ${
                  isAnimating
                    ? "opacity-0 translate-x-4"
                    : "opacity-100 translate-x-0"
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}>
                <div className="h-24 sm:h-28 md:h-32 w-40 md:w-48 flex items-center justify-center">
                  <img
                    src={env.IMAGE_BASE_URL + partner.image}
                    alt={partner.company}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-110"
                    style={{ transform: `scale(${partner.scale || 1})` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Custom Pagination - only show if more than 1 partner */}
          {partners.length > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {partners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-white dark:bg-gray-200 w-6 h-3.5 border-2 border-gray-900 dark:border-gray-600"
                      : "bg-gray-900 dark:bg-gray-600 w-3.5 h-3.5 border-2 border-white dark:border-gray-300"
                  } rounded-full hover:scale-110`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
