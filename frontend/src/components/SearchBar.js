import React from 'react';

const SearchBar = () => {
  return (
    <form role="search" aria-label="Situs" className="mx-auto max-w-3xl px-4">
      <label htmlFor="site-search" className="sr-only">Cari di situs</label>
      <div className="relative">
        <input
          id="site-search"
          type="search"
          placeholder="Cari program, berita, atau fasilitas..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700">
          Cari
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
