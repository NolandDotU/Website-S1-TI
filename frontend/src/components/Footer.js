import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2025 Your Company. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-sm hover:text-gray-300 transition">Privacy Policy</a>
            <a href="/terms" className="text-sm hover:text-gray-300 transition">Terms of Service</a>
            <a href="/contact" className="text-sm hover:text-gray-300 transition">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
