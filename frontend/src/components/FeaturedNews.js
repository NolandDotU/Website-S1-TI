
import React from 'react';
import { motion } from 'framer-motion';
import news from '../data/news';
import NewsCard from './NewsCard';

const FeaturedNews = () => {
  // Always show exactly 4 news items (min and max)
  let latestNews = news.slice(0, 4);
  // If less than 4, fill with empty placeholders
  if (latestNews.length < 4) {
    latestNews = [
      ...latestNews,
      ...Array(4 - latestNews.length).fill(null)
    ];
  }
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
          {latestNews.map((item, index) => (
            <motion.div
              key={item ? item.id : `empty-${index}`}
              custom={index}
              variants={{
                hidden: (i) => ({
                  opacity: 0,
                  x: i % 2 === 0 ? -50 : 50,
                }),
                visible: (i) => ({
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    delay: i * 0.3,
                  },
                }),
              }}
            >
              {item ? (
                <NewsCard
                  title={item.title}
                  date={new Date(item.uploadDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  summary={item.content}
                  image={item.photo}
                />
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 h-full min-h-[180px] flex items-center justify-center text-slate-400">
                  Berita belum tersedia
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedNews;
