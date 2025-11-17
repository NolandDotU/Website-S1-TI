import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-blue-800 text-white shadow-lg">
      <div className="flex flex-col h-full px-4 py-6">
        <div className="text-2xl font-bold mb-8">
          <a href="/" className="hover:text-gray-300">Logo</a>
        </div>
        <ul className="flex flex-col space-y-4">
          <li>
            <a href="/" className="block py-2 px-4 rounded hover:bg-gray-700 transition">Home</a>
          </li>
          <li>
            <a href="/about" className="block py-2 px-4 rounded hover:bg-gray-700 transition">About</a>
          </li>
          <li>
            <a href="/services" className="block py-2 px-4 rounded hover:bg-gray-700 transition">Services</a>
          </li>
          <li>
            <a href="/contact" className="block py-2 px-4 rounded hover:bg-gray-700 transition">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
