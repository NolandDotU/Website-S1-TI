import React from 'react';
import Logo from '../assets/Logo-DMl9ckBx.png';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full text-black">
      <div className="max-w-full mx-auto px-10 pt-2">
        <div className="flex h-16 items-center justify-start  gap-20">
          <a href="/" className="text-2xl font-bold hover:text-gray-300">
            <img src={Logo} alt="Logo" className="h-14" />
          </a>

          <ul className="flex bg-gradient-to-b from-gray-50 to-gray-100 items-center space-x-6 border-2 border-gray-300 p-2 rounded-xl">
            <li>
              <a href="/" className="py-2 px-3 rounded hover:bg-gray-300 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="py-2 px-3 rounded hover:bg-gray-300 transition">
                Berita
              </a>
            </li>
            <li>
              <a href="/services" className="py-2 px-3 rounded hover:bg-gray-300 transition">
                Lainnya
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
