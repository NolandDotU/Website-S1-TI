import React from 'react';
import { motion } from 'framer-motion';

const news = [
  { id: 1, title: 'Riset AI Terbaru Dipublikasikan', date: 'Nov 24, 2025', summary: 'Tim peneliti merilis temuan pada pengolahan bahasa.' },
  { id: 2, title: 'Mahasiswa Raih Juara Hackathon', date: 'Nov 10, 2025', summary: 'Kolaborasi lintas jurusan menghasilkan solusi inovatif.' },
  { id: 3, title: 'Kerja Sama Industri Baru', date: 'Oct 29, 2025', summary: 'Kemitraan strategis untuk magang dan riset terapan.' },
];

const FeaturedNews = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
      }}
      className="bg-white dark:bg-gray-900"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } }
          }}
          className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16"
        >
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            Featured News
          </h2>
          <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
            Stay up-to-date with the latest research, student achievements, and campus events.
          </p>
        </motion.div>
        <div className="grid gap-8 lg:grid-cols-2">
          {news.map((n, index) => (
            <motion.article 
              key={n.id}
              custom={index}
              variants={{
                hidden: (index) => ({
                  opacity: 0,
                  x: index % 2 === 0 ? -50 : 50,
                }),
                visible: (index) => ({
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.3,
                  },
                }),
              }}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-5 flex items-center justify-between text-gray-500">
                <span className="text-sm">{n.date}</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <a href="#">{n.title}</a>
              </h2>
              <p className="mb-5 font-light text-gray-500 dark:text-gray-400">{n.summary}</p>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Read more
                  <svg
                    className="ms-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedNews;
