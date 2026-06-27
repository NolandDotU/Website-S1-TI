import React, { useState, useEffect } from "react";
import Logo from "../assets/logo/Logo-DMl9ckBx.png";
import K2I from "../assets/logo/K2I.png";
import { getSettings } from "../services/settings.service";

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then((res) => {
      if (res && res.data) {
        setSettings(res.data);
      }
    }).catch(console.error);
  }, []);

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
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {/* Column 1: Logo */}
            <div className="space-y-4">
              <img src={K2I} alt="FTI UKSW Logo" className="h-32 sm:h-40 md:h-56 w-auto" />
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
                  href={`mailto:${settings?.prodiEmail || "fti@uksw.edu"}`}
                  className="underline hover:text-gray-300">
                  {settings?.prodiEmail || "fti@uksw.edu"}
                </a>
              </p>
              <div className="space-y-1 text-xs text-gray-300">
                <p>Senin - Jumat: 08.00 - 16.00 WIB</p>
                <p>Telp (Kampus Pusat): {settings?.prodiPhone || "(0298) 321212"}</p>
              </div>
              <a href={settings?.prodiMapsLink || "#"} target="_blank" rel="noreferrer" className="space-y-2 text-sm leading-relaxed whitespace-pre-line hover:text-gray-300 transition block">
                {settings?.prodiAddress || "Gedung Fakultas Teknologi Informasi,\nKampus III Universitas Kristen Satya Wacana\n\nJl. Dr. O. Notohamidjojo, Blotongan,\nSidorejo, Kota Salatiga, 50715, Indonesia"}
              </a>
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
                    href="https://siasat.uksw.edu/"
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
                    href="https://flearn.uksw.edu/"
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
