import React from "react";
import { AlertCircle, Lock, Home } from "lucide-react";

export const NoAccessPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 relative">
      {/* Watermark */}
      <div className="fixed bottom-6 left-6 flex items-center gap-3 opacity-40 pointer-events-none">
        <img
          src="/src/assets/logoFTI-CNN7ms1i.png"
          alt="Logo FTI"
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-700">Program Studi</p>
          <p className="text-xs font-medium text-gray-600">
            S1 Teknik Informatika
          </p>
        </div>
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Akses Ditolak
          </h1>

          <p className="text-gray-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini
            hanya dapat diakses oleh pengguna yang berwenang.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-orange-900 mb-1">
                  Kemungkinan Penyebab:
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Izin akses tidak mencukupi</li>
                  <li>• Memerlukan akses admin</li>
                  <li>• Akun belum diverifikasi</li>
                  <li>• Sesi telah berakhir</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Kembali
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPage;
