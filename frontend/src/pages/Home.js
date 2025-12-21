import React from "react";

// Import all home page sections
import Carousel from "../components/Carousel";
import HeroBanner from "../components/HeroBanner";
import AdmissionsHighlights from "../components/AdmissionsHighlights";
import FeaturedNews from "../components/FeaturedNews";
import TentangTISection from "../components/TentangTISection";
import KerjaSamaSection from "../components/KerjaSamaSection";
import LayananKampusSection from "../components/LayananKampusSection";

const HomePage = () => {
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
