import React, { useState } from "react";
import Sertifikat from "../assets/sertif-akreditasi.jpg";

const TentangProdi = () => {
  const [activeTab, setActiveTab] = useState("visi-misi");

  const handleDownloadSertifikat = () => {
    const link = document.createElement("a");
    link.href = Sertifikat;
    link.download = "Sertifikat-Akreditasi-Teknik-Informatika-UKSW.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const peminatanData = [
    {
      title: "Network Engineering",
      description:
        "Fokus pada perancangan, pembangunan, dan pengelolaan infrastruktur jaringan komputer yang handal dan aman.",
    },
    {
      title: "Software Engineering",
      description:
        "Spesialisasi dalam pengembangan perangkat lunak dan aplikasi berbasis metodologi rekayasa perangkat lunak modern.",
    },
    {
      title: "Data Science",
      description:
        "Mengolah dan menganalisis data untuk memberikan nilai tambah dan mendukung pengambilan keputusan organisasi.",
    },
  ];

  const profilLulusanData = [
    {
      title: "Software Developer",
      desc: "Mengembangkan perangkat lunak untuk perusahaan, instansi pemerintahan, atau wirausaha",
    },
    {
      title: "Network Engineer",
      desc: "Merancang dan mengelola infrastruktur jaringan",
    },
    {
      title: "Data Scientist",
      desc: "Mengumpulkan, mengolah, dan menganalisa data untuk keperluan bisnis",
    },
    {
      title: "Data Engineer",
      desc: "Mengelola arsitektur data perusahaan/instansi",
    },
    {
      title: "Database Administrator",
      desc: "Mengelola dan mengembangkan basis data operasional",
    },
    {
      title: "System Analyst",
      desc: "Merencanakan dan memberikan rekomendasi sistem IT",
    },
    {
      title: "IT Support",
      desc: "Mendukung kebutuhan IT seperti instalasi dan evaluasi sistem",
    },
    {
      title: "Akademisi",
      desc: "Mentransformasi dan mengembangkan ilmu pengetahuan",
    },
    {
      title: "Peneliti",
      desc: "Mengembangkan ilmu pengetahuan melalui penelitian",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-20 dark:opacity-30"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-block mb-4 px-6 py-2 bg-white bg-opacity-20 dark:bg-opacity-10 rounded-full border border-white border-opacity-30">
            <span className="text-sm font-semibold tracking-wide">
              AKREDITASI UNGGUL
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Program Studi Teknik Informatika
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-95 dark:opacity-90">
            Memenuhi kebutuhan sumber daya manusia yang handal serta mampu
            merencanakan dan mengimplementasikan teknologi informasi untuk
            berbagai keperluan
          </p>
          <p className="mt-6 text-sm opacity-80 dark:opacity-70">
            BAN-PT No. 3925/SK/BAN-PT/Ak.KP/S/X/2023
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Text Content - tetap sama */}
            <div className="flex-1 h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Tentang Program Studi
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Program Studi S1 Teknik Informatika dirancang untuk menghasilkan
                lulusan yang kompeten dalam bidang teknologi informasi dengan
                landasan akademik yang kuat, kemampuan analitis yang tajam, dan
                keterampilan praktis yang relevan dengan kebutuhan industri.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Dengan akreditasi Unggul dari BAN-PT, program studi ini
                berkomitmen untuk mengembangkan mahasiswa menjadi profesional IT
                yang tidak hanya menguasai teknologi, tetapi juga memiliki
                integritas, kepemimpinan, dan kepekaan terhadap perubahan
                teknologi global.
              </p>
            </div>

            {/* Certificate Image with Download Button */}
            <div className="lg:w-80 w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center">
                  Sertifikat Akreditasi
                </h3>
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <img
                  src={Sertifikat}
                  alt="Sertifikat Akreditasi BAN-PT"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 mb-4">
                Akreditasi Unggul dari BAN-PT
              </p>

              {/* Download Button */}
              <button
                onClick={handleDownloadSertifikat}
                className="w-full px-4 py-2.5 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Sertifikat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bidang Peminatan */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            Bidang Peminatan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {peminatanData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-700 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["visi-misi", "profil-lulusan", "kurikulum"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-700 dark:bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                }`}>
                {tab === "visi-misi" && "Visi & Misi"}
                {tab === "profil-lulusan" && "Profil Lulusan"}
                {tab === "kurikulum" && "Kurikulum"}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            {activeTab === "visi-misi" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Visi Program Studi
                  </h3>
                  <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-700 dark:border-blue-500 p-6 rounded">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Pada tahun 2030 menjadi pusat unggulan Teknik Informatika
                      untuk menghasilkan pemimpin yang menjunjung tinggi nilai
                      kebenaran dan iman Kristiani serta memiliki kepekaan
                      terhadap perubahan dan berkontribusi terhadap pengembangan
                      Teknik Informatika berlandaskan nilai kritis, kreatif, dan
                      inovatif.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Misi Program Studi
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Melaksanakan proses pembelajaran yang berbasis keunggulan dalam bidang teknik informatika yang menjunjung tinggi nilai kebenaran dan iman Kristiani.",
                      "Melaksanakan penelitian yang berbasis keunggulan dan selaras dengan perkembangan teknik informatika yang berciri kritis, kreatif, dan inovatif.",
                      "Melaksanakan pengabdian masyarakat yang berbasis keunggulan dalam bidang teknik informatika yang berciri pada semangat pelayanan.",
                      "Mengembangkan kepemimpinan yang mencerminkan sikap kritis, kreatif, dan inovatif serta memiliki kepekaan terhadap perubahan.",
                      "Menciptakan dan mengembangkan sinergi antara pengajaran, penelitian dan pengabdian masyarakat dalam semangat pelayanan dengan berbagai pihak, baik di dalam maupun luar negeri.",
                    ].map((misi, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                        <span className="flex-shrink-0 w-7 h-7 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                          {misi}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "profil-lulusan" && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  Profil Lulusan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Lulusan Program Studi Teknik Informatika dibekali dengan
                  kompetensi untuk berkarir di berbagai bidang teknologi
                  informasi, baik di sektor industri, pemerintahan, maupun
                  akademis.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profilLulusanData.map((profil, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-blue-700 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {profil.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {profil.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "kurikulum" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Kurikulum 2021
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    SK Rektor No. 318/Kep./Rek/8/2021 tentang Pemberlakuan
                    Kurikulum Program Studi S1 Teknik Informatika
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
                    Perubahan Utama
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Program Merdeka Belajar Kampus Merdeka",
                        desc: "Mahasiswa dapat mengambil 20 SKS di luar prodi tetapi masih di UKSW, dan 24 SKS di luar UKSW melalui magang industri, KKN-Tematik, penelitian, pertukaran pelajar, asistensi mengajar, project independen, kegiatan kemanusiaan, dan kewirausahaan.",
                      },
                      {
                        title: "Kolaborasi dengan Industri",
                        desc: "Pembelajaran satu semester penuh oleh industri melalui mata kuliah kapita selekta untuk memastikan relevansi kurikulum dengan kebutuhan dunia kerja.",
                      },
                      {
                        title: "Penyesuaian Konsentrasi",
                        desc: "Penguatan bidang Data Science sesuai kebutuhan industri dan perkembangan teknologi terkini.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-800 p-5 rounded border border-gray-200 dark:border-gray-700">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                          {item.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
                    Strategi Pembelajaran Bertahap
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        year: "Tahun 1",
                        focus: "Dasar-dasar Teknik Informatika",
                      },
                      {
                        year: "Tahun 2",
                        focus: "Peningkatan Keterampilan",
                      },
                      {
                        year: "Tahun 3",
                        focus: "Pendalaman Sesuai Peminatan",
                      },
                      {
                        year: "Tahun 4",
                        focus: "Pembelajaran Luar Prodi & Tugas Akhir",
                      },
                    ].map((tahun, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                        <div className="flex-shrink-0 w-20 h-20 bg-blue-700 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm text-center">
                            {tahun.year}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {tahun.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-700 dark:border-blue-500 p-6 rounded">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-gray-800 dark:text-gray-100">
                      Pengembangan Holistik:
                    </strong>{" "}
                    Kurikulum dirancang untuk mengembangkan tidak hanya hard
                    skill tetapi juga soft skill, sehingga lulusan dapat
                    beradaptasi dengan perubahan dan perkembangan ilmu
                    pengetahuan serta teknologi.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Informasi Lebih Lanjut
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Untuk informasi pendaftaran dan program akademik, silakan hubungi
            kami atau kunjungi halaman admisi
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.uksw.edu/informasi-pendaftaran/"
              className="px-8 py-3 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
              Informasi Admisi
            </a>
            <a
              href="mailto:fti@uksw.edu"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-2 border-blue-700 dark:border-blue-500 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TentangProdi;
