import React, { useState } from "react";
import { motion } from "framer-motion";

const TentangProdi = () => {
  const [activeTab, setActiveTab] = useState("visi-misi");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const peminatanData = [
    {
      title: "Network Engineering",
      icon: "🌐",
      description:
        "Fokus pada perancangan, pembangunan, dan pengelolaan infrastruktur jaringan komputer",
      gradient: "from-gray-700 to-gray-900",
    },
    {
      title: "Software Engineering",
      icon: "💻",
      description:
        "Spesialisasi dalam pengembangan perangkat lunak dan aplikasi",
      gradient: "from-gray-800 to-gray-950",
    },
    {
      title: "Data Science",
      icon: "📊",
      description:
        "Mengolah dan menganalisis data untuk memberikan nilai tambah bagi organisasi",
      gradient: "from-gray-600 to-gray-800",
    },
  ];

  const profilLulusanData = [
    {
      title: "Software Developer",
      icon: "👨‍💻",
      desc: "Mengembangkan perangkat lunak untuk perusahaan, instansi pemerintahan, atau wirausaha",
    },
    {
      title: "Network Engineer",
      icon: "🔌",
      desc: "Merancang dan mengelola infrastruktur jaringan",
    },
    {
      title: "Data Scientist",
      icon: "📈",
      desc: "Mengumpulkan, mengolah, dan menganalisa data untuk keperluan bisnis",
    },
    {
      title: "Data Engineer",
      icon: "🗄️",
      desc: "Mengelola arsitektur data perusahaan/instansi",
    },
    {
      title: "Database Administrator",
      icon: "💾",
      desc: "Mengelola dan mengembangkan basis data operasional",
    },
    {
      title: "System Analyst",
      icon: "🔍",
      desc: "Merencanakan dan memberikan rekomendasi sistem IT",
    },
    {
      title: "IT Support",
      icon: "🛠️",
      desc: "Mendukung kebutuhan IT seperti instalasi dan evaluasi sistem",
    },
    {
      title: "Akademisi",
      icon: "👨‍🏫",
      desc: "Mentransformasi dan mengembangkan ilmu pengetahuan",
    },
    {
      title: "Peneliti",
      icon: "🔬",
      desc: "Mengembangkan ilmu pengetahuan melalui penelitian",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600">
            <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
              AKREDITASI UNGGUL
            </span>
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
            Program Studi Teknik Informatika
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Memenuhi kebutuhan sumber daya manusia yang handal serta mampu
            merencanakan dan mengimplementasikan teknologi informasi untuk
            berbagai keperluan
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-semibold">
              BAN-PT No. 3925/SK/BAN-PT/Ak.KP/S/X/2023
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Peminatan Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Bidang Peminatan
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {peminatanData.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                <div className="p-8">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tabs Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["visi-misi", "profil-lulusan", "kurikulum"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all border-2 ${
                  activeTab === tab
                    ? "bg-gray-900 dark:bg-gray-700 text-white border-gray-900 dark:border-gray-600 shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}>
                {tab === "visi-misi" && "Visi & Misi"}
                {tab === "profil-lulusan" && "Profil Lulusan"}
                {tab === "kurikulum" && "Kurikulum"}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-200 dark:border-gray-700">
            {activeTab === "visi-misi" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Visi Program Studi
                  </h3>
                  <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
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
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Misi Program Studi
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Melaksanakan proses pembelajaran yang berbasis keunggulan dalam bidang teknik informatika yang menjunjung tinggi nilai kebenaran dan iman Kristiani.",
                      "Melaksanakan penelitian yang berbasis keunggulan dan selaras dengan perkembangan teknik informatika yang berciri kritis, kreatif, dan inovatif.",
                      "Melaksanakan pengabdian masyarakat yang berbasis keunggulan dalam bidang teknik informatika yang berciri pada semangat pelayanan.",
                      "Mengembangkan kepemimpinan yang mencerminkan sikap kritis, kreatif, dan inovatif serta memiliki kepekaan terhadap perubahan.",
                      "Menciptakan dan mengembangkan sinergi antara pengajaran, penelitian dan pengabdian masyarakat dalam semangat pelayanan dengan berbagai pihak, baik di dalam maupun luar negeri.",
                    ].map((misi, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                        <span className="flex-shrink-0 w-8 h-8 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
                <h3 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                  Peluang Karir Lulusan
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profilLulusanData.map((profil, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-md border-2 border-gray-300 dark:border-gray-600">
                      <div className="text-3xl mb-3">{profil.icon}</div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                        {profil.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {profil.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "kurikulum" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Kurikulum 2021
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    SK Rektor No. 318/Kep./Rek/8/2021 tentang Pemberlakuan
                    Kurikulum Program Studi S1 Teknik Informatika
                  </p>
                </div>

                <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border-2 border-gray-300 dark:border-gray-600">
                  <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                    Perubahan Utama:
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Program Merdeka Belajar Kampus Merdeka: Mahasiswa dapat mengambil 20 SKS di luar prodi tetapi masih di UKSW, dan 24 SKS di luar UKSW (magang industri, KKN-Tematik, penelitian, pertukaran pelajar, asistensi mengajar, project independen, kegiatan kemanusiaan, dan kewirausahaan)",
                      "Kolaborasi dengan Industri: Pembelajaran satu semester penuh oleh industri melalui mata kuliah kapita selekta",
                      "Penyesuaian Konsentrasi: Penguatan bidang Data Science sesuai kebutuhan industri",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                    Strategi Pembelajaran Bertahap:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        year: "Tahun 1",
                        focus: "Dasar-dasar Teknik Informatika",
                        color: "from-gray-700 to-gray-900",
                      },
                      {
                        year: "Tahun 2",
                        focus: "Peningkatan Keterampilan",
                        color: "from-gray-800 to-gray-950",
                      },
                      {
                        year: "Tahun 3",
                        focus: "Pendalaman Sesuai Peminatan",
                        color: "from-gray-600 to-gray-800",
                      },
                      {
                        year: "Tahun 4",
                        focus: "Pembelajaran Luar Prodi & Tugas Akhir",
                        color: "from-gray-500 to-gray-700",
                      },
                    ].map((tahun, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 shadow-md border-2 border-gray-300 dark:border-gray-600">
                        <div
                          className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${tahun.color} text-white font-bold mb-3`}>
                          {tahun.year}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {tahun.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-l-4 border-gray-800 dark:border-gray-600 p-6 rounded">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Pengembangan Holistik:</strong> Kurikulum dirancang
                    untuk mengembangkan tidak hanya hard skill tetapi juga soft
                    skill, sehingga lulusan dapat beradaptasi dengan perubahan
                    dan perkembangan ilmu pengetahuan serta teknologi.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Jadilah bagian dari generasi IT profesional yang kritis, kreatif,
            dan inovatif
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/akademik/admisi.html"
              className="px-8 py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-900 dark:border-gray-600">
              Informasi Admisi
            </a>
            <a
              href="mailto:fti@uksw.edu"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-750">
              Hubungi Kami
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TentangProdi;
