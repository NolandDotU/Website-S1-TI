import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TentangTISection from './components/TentangTISection';
import LayananKampusSection from './components/LayananKampusSection';
import HeroBanner from './components/HeroBanner';
import Carousel from './components/Carousel';
import AdmissionsHighlights from './components/AdmissionsHighlights';
import FeaturedNews from './components/FeaturedNews';
import KerjaSamaSection from './components/KerjaSamaSection';
import Toggle from './components/Toggle';

import LecturerProfiles from './pages/LecturerProfiles';
import { AdminDashboard } from './pages/admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Berita from './pages/Berita';

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

  // Home page component
  const HomePage = () => (
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

  return (
    <Routes>
      {/* Login route without navbar/footer */}
      <Route path="/login" element={<Login />} />
      
      {/* All other routes with navbar/footer */}
      <Route path="*" element={
        <div className={`flex flex-col min-h-screen dark:bg-gray-900 px-4 md:px-8 lg:px-12`}>
          <div className="fixed top-4 right-4 z-50">
            <Toggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="w-full flex-grow bg-white dark:bg-gray-900">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/berita" element={<Berita />} />
                <Route path="/profil-dosen" element={<LecturerProfiles />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer className="p-20" />
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
