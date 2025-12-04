import React from 'react';
import { motion } from 'framer-motion';

const items = [
  { title: 'Sarjana (S1)', desc: 'Program komprehensif dengan kurikulum berbasis industri.' },
  { title: 'Beasiswa', desc: 'Beragam skema beasiswa untuk mahasiswa berprestasi.' },
  { title: 'Penerimaan', desc: 'Jalur reguler, prestasi, dan kemitraan sekolah.' },
];

const AdmissionsHighlights = () => {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } }
      }}
      id="admissions" 
      className="bg-white dark:bg-gray-900"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          {items.map((i, index) => (
            <motion.div 
              key={i.title}
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
                    delay: index * 0.2,
                  },
                }),
              }}
              className="flex flex-col items-center text-center"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                    {/* SVG Icon Placeholder */}
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>
                </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">{i.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{i.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AdmissionsHighlights;
