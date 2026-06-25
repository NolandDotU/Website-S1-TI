import React from "react";
import LogoTI from "../assets/logo/logoFTI-CNN7ms1i.png";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-center mb-6">
          <img
            src={LogoTI}
            alt="Logo TI UKSW"
            className="h-16 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Sistem Sedang Dalam Pemeliharaan
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Kami sedang melakukan peningkatan sistem untuk memberikan layanan yang lebih baik. Silakan kembali lagi nanti.
        </p>

        <div className="bg-blue-50 text-blue-800 rounded-lg p-4 text-sm font-medium">
          Estimasi Waktu: Segera kembali!
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Jika ada keadaan darurat, silakan hubungi:</p>
          <a href="mailto:fti@uksw.edu" className="text-blue-600 hover:underline">
            fti@uksw.edu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
