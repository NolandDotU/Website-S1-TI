import React, { useState } from 'react';
import image1 from '../assets/image.png';

// Your images - add more image imports as needed
const defaultSlides = [
  { id: 1, img: image1, label: '*' },
  { id: 2, img: image1, label: '*' },
  { id: 3, img: image1, label: 'berdiri pada tahun 2003 dengan program studi pertama adalah Program Studi S1 Teknik Informatika.' },
];

const Carousel = ({ slides = defaultSlides }) => {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const goTo = (i) => setIndex(i);

  return (
    <div className="w-full min-h-screen mx-auto">
      <div className="relative">
        {/* Viewport */}
        <div className="overflow-hidden rounded-[30px] shadow-lg">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
            role="group"
            aria-roledescription="carousel"
          >
            {slides.map((s, i) => (
              <div key={s.id} className="w-full shrink-0">
                <div className="h-96 md:h-[600px] lg:h-[700px] relative overflow-hidden">
                  <img 
                    src={s.img} 
                    alt={s.label}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      i === index ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                  />
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 md:p-12 transition-all duration-700 delay-300 ${
                    i === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                        {s.label}
                      </h2>
                      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute right-6 bottom-6 flex gap-3">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="rounded-xl bg-white/40 hover:bg-black/60 text-white p-3 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="rounded-xl bg-white/40 hover:bg-black/60 text-white p-3 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 1 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
