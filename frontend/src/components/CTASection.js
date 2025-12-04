import React from 'react';

const CTASection = ({ title = 'Siap Bergabung?', desc = 'Daftar dan mulai perjalanan akademikmu hari ini.', primaryText = 'Mulai Pendaftaran', secondaryText = 'Hubungi Kami' }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-slate-700 dark:text-gray-300">{desc}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">
            {primaryText}
          </a>
          <a href="#" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-900 font-medium hover:bg-slate-50">
            {secondaryText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
