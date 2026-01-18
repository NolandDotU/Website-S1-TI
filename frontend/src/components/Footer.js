import React from "react";
import Logo from "../assets/logo/Logo-DMl9ckBx.png";
import K2I from "../assets/logo/K2I.png";

const Footer = () => {
  return (
    <footer className="w-full p-5 relative">
      {/* Vertical lines extending through footer - aligned with page lines */}
      <div className="absolute inset-0 pointer-events-none left-0 right-0">
        <div className="h-full flex justify-around">
          <div className="w-px bg-gray-800"></div>
          <div className="w-px bg-gray-800"></div>
          <div className="w-px bg-gray-800"></div>
          <div className="w-px bg-gray-800"></div>
          <div className="w-px bg-gray-800"></div>
          <div className="w-px bg-gray-800"></div>
        </div>
      </div>

      <div className="bg-gray-950 text-white rounded-[20px] shadow-2xl p-10 relative z-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Column 1: Logo */}
            <div className="space-y-4">
              <img src={K2I} alt="FTI UKSW Logo" className="h-56 w-auto" />
              <p className="font-semibold text-lg">
                Fakultas Teknologi Informasi
              </p>
            </div>
            {/* Column 2: Contact + Address */}
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">Kontak</h3>
              <p className="text-sm">
                Email:{" "}
                <a
                  href="mailto:fti@uksw.edu"
                  className="underline hover:text-gray-300">
                  fti@uksw.edu
                </a>
              </p>
              <div className="space-y-1 text-xs text-gray-300">
                <p>Senin - Jumat: 08.00 - 16.00 WIB</p>
                <p>Telp (Kampus Pusat): (0298) 321212</p>
              </div>
              <div className="space-y-2 text-sm leading-relaxed">
                <p>
                  Gedung Fakultas Teknologi Informasi,
                  <br /> Kampus III Universitas Kristen Satya Wacana
                </p>
                <p>
                  Jl. Dr. O. Notohamidjojo, Blotongan,
                  <br /> Sidorejo, Kota Salatiga, 50715, Indonesia
                </p>
              </div>
            </div>
            {/* Column 3: Resources */}
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">University Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.uksw.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition">
                    Website Universitas Kristen Satya Wacana
                  </a>
                </li>
                <li>
                  <a
                    href="https://siakad.uksw.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition">
                    Sistem Informasi Akademik Satya Wacana
                  </a>
                </li>
                <li>
                  <a
                    href="https://library.uksw.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition">
                    Perpustakaan Universitas
                  </a>
                </li>
                <li>
                  <a
                    href="https://flexiblelearning.uksw.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition">
                    Flexible Learning UKSW
                  </a>
                </li>
                <li>
                  <a
                    href="https://ejournal.uksw.edu/aiti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition">
                    Jurnal AITI Fakultas Teknologi Informasi
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-xs md:text-sm flex flex-col md:flex-row justify-between gap-4">
            <p>
              © 2025 Fakultas Teknologi Informasi Universitas Kristen Satya
              Wacana
            </p>
            <div className="flex flex-wrap gap-4 text-gray-400">
              <a href="/privacy" className="hover:text-gray-200">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-gray-200">
                Terms of Service
              </a>
              <a href="/help" className="hover:text-gray-200">
                Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
