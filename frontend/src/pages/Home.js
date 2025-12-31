import React, { useState, useEffect } from "react";
import Skeleton from "../components/Skeleton";

// Import all home page sections
import Carousel from "../components/Carousel";
import HeroBanner from "../components/HeroBanner";
import AdmissionsHighlights from "../components/AdmissionsHighlights";
import FeaturedNews from "../components/FeaturedNews";
import TentangTISection from "../components/TentangTISection";
import KerjaSamaSection from "../components/KerjaSamaSection";
import LayananKampusSection from "../components/LayananKampusSection";


const HomePage = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="space-y-6 px-4 py-8 max-w-7xl mx-auto">
        <Skeleton height={320} />
        <Skeleton height={120} />
        <Skeleton height={80} />
        <Skeleton height={200} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </div>
    );
  }
  return (
    <>
      <Carousel />
      <HeroBanner />
      <AdmissionsHighlights />
      <FeaturedNews />
      <TentangTISection />
      <KerjaSamaSection />
      <LayananKampusSection />
    </>
  );
};

export default HomePage;
