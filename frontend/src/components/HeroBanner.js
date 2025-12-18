import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } }
      }}
      className="bg-white dark:bg-gray-900"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16">
        <motion.h1 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } }
          }}
          className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
        >
          Fakultas Teknologi Informasi
        </motion.h1>
        <motion.p 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 } }
          }}
          className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:px-48 lg:text-xl"
        >
          Lingkungan akademik modern, riset berkelas, dan komunitas yang mendorong inovasi. Jelajahi program, fasilitas, dan kesempatan untuk bertumbuh.
        </motion.p>
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.6 } }
          }}
          className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0"
        >
          <a
            href="https://www.uksw.edu/informasi-pendaftaran/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => {
              e.preventDefault();
              window.open("https://www.uksw.edu/informasi-pendaftaran/", "_blank", "noopener,noreferrer");
            }}
          >
            Daftar Sekarang
            <svg
              className="ms-2 h-3.5 w-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          <a
            href="#academics"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:ms-4"
            onClick={e => {
              e.preventDefault();
              window.open("#academics", "_blank");
            }}
          >
            Lihat Program
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
