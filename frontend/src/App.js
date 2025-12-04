import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TentangTISection from './components/TentangTISection';
import LayananKampusSection from './components/LayananKampusSection';
import HeroBanner from './components/HeroBanner';
import AdmissionsHighlights from './components/AdmissionsHighlights';
import FeaturedNews from './components/FeaturedNews';
import CTASection from './components/CTASection';
import KerjaSamaSection from './components/KerjaSamaSection';
import Toggle from './components/Toggle';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800`}>
      <div className="fixed top-4 right-4 z-50">
        <Toggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="w-full flex-grow bg-white dark:bg-gray-900">
          <HeroBanner />
          <AdmissionsHighlights />
          <FeaturedNews />
          <TentangTISection />
          <KerjaSamaSection />
          <LayananKampusSection />
          <CTASection />
        </main>
        <Footer className="p-20" />
      </div>
    </div>
  );
}

export default App;
