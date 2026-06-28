import React, { useState, useEffect, useRef } from "react";

// Import all home page sections
import Carousel from "../components/Carousel";
import HeroBanner from "../components/HeroBanner";
import AdmissionsHighlights from "../components/AdmissionsHighlights";
import FeaturedNews from "../components/FeaturedNews";
import FeaturedPengumuman from "../components/FeaturedPengumuman";
import TentangTISection from "../components/TentangTISection";
import KerjaSamaSection from "../components/KerjaSamaSection";
import LayananKampusSection from "../components/LayananKampusSection";
import { getAllHighlight } from "../services/api";
import { useFadeIn } from "../hooks/useAnimations";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [carousel, setCarousel] = useState([]);
  const pageRef = useRef(null);

  useFadeIn(pageRef);

  const fetchCarousel = async () => {
    try {
      const response = await getAllHighlight();
      setCarousel(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carousel:", error);
    }
  };

  useEffect(() => {
    fetchCarousel();
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col animate-pulse">
        {/* Carousel Skeleton */}
        <div className="w-full h-[60vh] min-h-[400px] bg-gray-200 dark:bg-gray-800" />
        
        {/* Hero Section Skeleton */}
        <div className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
          <div className="w-3/4 max-w-2xl h-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6" />
          <div className="w-1/2 max-w-xl h-6 bg-gray-200 dark:bg-gray-800 rounded-lg mb-10" />
          <div className="flex gap-4">
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        </div>

        {/* Featured News/Section Skeleton */}
        <div className="w-full bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="w-64 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KerjaSama Section Skeleton */}
        <div className="w-full py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="w-48 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-10" />
            <div className="flex gap-6 overflow-hidden justify-center w-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="hidden md:block w-48 lg:w-56 h-24 sm:h-28 md:h-32 bg-gray-200 dark:bg-gray-800 rounded-xl flex-shrink-0" />
              ))}
              <div className="md:hidden flex gap-6 w-full justify-center">
                <div className="w-40 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="w-40 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Layanan Kampus Section Skeleton */}
        <div className="w-full py-10 sm:py-12 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="w-56 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow flex flex-col gap-3">
                  <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div ref={pageRef}>
      <Carousel slides={carousel} />
      <HeroBanner />
      {/* <AdmissionsHighlights /> */}
      <FeaturedNews />
      <FeaturedPengumuman />
      {/* <TentangTISection /> */}
      <KerjaSamaSection />
      <LayananKampusSection />
    </div>
  );
};

export default HomePage;
