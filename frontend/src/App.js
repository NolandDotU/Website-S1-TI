import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import PengumumanSection from './components/PengumumanSection';
import KerjaSamaSection from './components/KerjaSamaSection';
import TentangTISection from './components/TentangTISection';
import LayananKampusSection from './components/LayananKampusSection';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Vertical lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex justify-around">
          <div className="w-px bg-gray-200"></div>
          <div className="w-px bg-gray-200"></div>
          <div className="w-px bg-gray-200"></div>
          <div className="w-px bg-gray-200"></div>
          <div className="w-px bg-gray-200"></div>
          <div className="w-px bg-gray-200"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="w-full flex-grow p-5 space-y-16">
          <Carousel />
          <PengumumanSection />
          <KerjaSamaSection />
          <TentangTISection />
          <LayananKampusSection />
        </main>
        <Footer className="p-20" />
      </div>
    </div>
  );
}

export default App;
