import React, { useState } from 'react';
import { m } from 'framer-motion';
import { createLecturer } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('berita');
  const [showForm, setShowForm] = useState(false);

  // Form states for each content type
  const [beritaForm, setBeritaForm] = useState({
    id: '',
    judul: '',
    category: '',
    link: '',
    foto: '',
    tanggal_upload: '',
    tanggal_kegiatan: '',
    deskripsi: ''
  });

  const [dosenForm, setDosenForm] = useState({
    username: '',
    fullname: '',
    expertise: [''],
    email: '',
    externalLink: '',
    photo: ''
  });

  const [carouselForm, setCarouselForm] = useState({
    id: '',
    gambar: '',
    title: '',
    desc: ''
  });

  const [profilProdiForm, setProfilProdiForm] = useState({
    sejarah: '',
    visi: [''],
    misi: [''],
    dokumen_akreditasi_detail: '',
    dokumen_akreditasi_gambar: ''
  });

  // Handle form submissions
  const handleBeritaSubmit = (e) => {
    e.preventDefault();
    console.log('Berita submitted:', beritaForm);
    // TODO: Send to backend API
    alert('Berita berhasil ditambahkan!');
    setShowForm(false);
    setBeritaForm({
      id: '',
      judul: '',
      category: '',
      link: '',
      foto: '',
      tanggal_upload: '',
      tanggal_kegiatan: '',
      deskripsi: ''
    });
  };

  const handleDosenSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLecturer(dosenForm);
      alert('Data Dosen berhasil ditambahkan!');
      setShowForm(false);
      setDosenForm({
        username: '',
        fullname: '',
        expertise: [''],
        email: '',
        externalLink: '',
        photo: ''
      });
    } catch (error) {
      console.error('Error creating lecturer:', error);
      alert('Gagal menambahkan data dosen. Silakan coba lagi.');
    }
  };

  const handleCarouselSubmit = (e) => {
    e.preventDefault();
    console.log('Carousel submitted:', carouselForm);
    // TODO: Send to backend API
    alert('Carousel berhasil ditambahkan!');
    setShowForm(false);
    setCarouselForm({
      id: '',
      gambar: '',
      title: '',
      desc: ''
    });
  };

  const handleProfilProdiSubmit = (e) => {
    e.preventDefault();
    console.log('Profil Prodi submitted:', profilProdiForm);
    // TODO: Send to backend API
    alert('Profil Prodi berhasil diperbarui!');
    setShowForm(false);
  };

  // Helper functions for array fields
  const addExpertise = () => {
    setDosenForm({ ...dosenForm, expertise: [...dosenForm.expertise, ''] });
  };

  const removeExpertise = (index) => {
    const newExpertise = dosenForm.expertise.filter((_, i) => i !== index);
    setDosenForm({ ...dosenForm, expertise: newExpertise });
  };

  const updateExpertise = (index, value) => {
    const newExpertise = [...dosenForm.expertise];
    newExpertise[index] = value;
    setDosenForm({ ...dosenForm, expertise: newExpertise });
  };

  const addVisi = () => {
    setProfilProdiForm({ ...profilProdiForm, visi: [...profilProdiForm.visi, ''] });
  };

  const removeVisi = (index) => {
    const newVisi = profilProdiForm.visi.filter((_, i) => i !== index);
    setProfilProdiForm({ ...profilProdiForm, visi: newVisi });
  };

  const updateVisi = (index, value) => {
    const newVisi = [...profilProdiForm.visi];
    newVisi[index] = value;
    setProfilProdiForm({ ...profilProdiForm, visi: newVisi });
  };

  const addMisi = () => {
    setProfilProdiForm({ ...profilProdiForm, misi: [...profilProdiForm.misi, ''] });
  };

  const removeMisi = (index) => {
    const newMisi = profilProdiForm.misi.filter((_, i) => i !== index);
    setProfilProdiForm({ ...profilProdiForm, misi: newMisi });
  };

  const updateMisi = (index, value) => {
    const newMisi = [...profilProdiForm.misi];
    newMisi[index] = value;
    setProfilProdiForm({ ...profilProdiForm, misi: newMisi });
  };

  const tabs = [
    { id: 'berita', label: 'Berita', icon: '📰' },
    { id: 'dosen', label: 'Dosen', icon: '👨‍🏫' },
    { id: 'carousel', label: 'Carousel', icon: '🎠' },
    { id: 'profil', label: 'Profil Prodi', icon: '🏫' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="py-8 px-4 md:px-8 lg:px-12">
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola konten website Program Studi Teknik Informatika
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowForm(false);
                }}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Add Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah {activeTab === 'berita' ? 'Berita' : activeTab === 'dosen' ? 'Dosen' : activeTab === 'carousel' ? 'Carousel' : 'Profil Prodi'}
            </button>
          )}

          {/* Forms */}
          {showForm && (
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              {/* Berita Form */}
              {activeTab === 'berita' && (
                <form onSubmit={handleBeritaSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tambah Berita Baru</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        ID
                      </label>
                      <input
                        type="text"
                        value={beritaForm.id}
                        onChange={(e) => setBeritaForm({ ...beritaForm, id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={beritaForm.category}
                        onChange={(e) => setBeritaForm({ ...beritaForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={beritaForm.judul}
                      onChange={(e) => setBeritaForm({ ...beritaForm, judul: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Link
                    </label>
                    <input
                      type="url"
                      value={beritaForm.link}
                      onChange={(e) => setBeritaForm({ ...beritaForm, link: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL Foto
                    </label>
                    <input
                      type="url"
                      value={beritaForm.foto}
                      onChange={(e) => setBeritaForm({ ...beritaForm, foto: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Upload
                      </label>
                      <input
                        type="date"
                        value={beritaForm.tanggal_upload}
                        onChange={(e) => setBeritaForm({ ...beritaForm, tanggal_upload: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Kegiatan
                      </label>
                      <input
                        type="date"
                        value={beritaForm.tanggal_kegiatan}
                        onChange={(e) => setBeritaForm({ ...beritaForm, tanggal_kegiatan: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={beritaForm.deskripsi}
                      onChange={(e) => setBeritaForm({ ...beritaForm, deskripsi: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* Dosen Form */}
              {activeTab === 'dosen' && (
                <form onSubmit={handleDosenSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tambah Data Dosen</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={dosenForm.username}
                        onChange={(e) => setDosenForm({ ...dosenForm, username: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={dosenForm.email}
                        onChange={(e) => setDosenForm({ ...dosenForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={dosenForm.fullname}
                      onChange={(e) => setDosenForm({ ...dosenForm, fullname: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Keahlian
                    </label>
                    {dosenForm.expertise.map((exp, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={exp}
                          onChange={(e) => updateExpertise(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                        {dosenForm.expertise.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExpertise(index)}
                            className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                      + Tambah Keahlian
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL Foto
                    </label>
                    <input
                      type="url"
                      value={dosenForm.photo}
                      onChange={(e) => setDosenForm({ ...dosenForm, photo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Link Eksternal (Opsional)
                    </label>
                    <input
                      type="url"
                      value={dosenForm.externalLink}
                      onChange={(e) => setDosenForm({ ...dosenForm, externalLink: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* Carousel Form */}
              {activeTab === 'carousel' && (
                <form onSubmit={handleCarouselSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tambah Carousel Baru</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ID
                    </label>
                    <input
                      type="text"
                      value={carouselForm.id}
                      onChange={(e) => setCarouselForm({ ...carouselForm, id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      value={carouselForm.gambar}
                      onChange={(e) => setCarouselForm({ ...carouselForm, gambar: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={carouselForm.title}
                      onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={carouselForm.desc}
                      onChange={(e) => setCarouselForm({ ...carouselForm, desc: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* Profil Prodi Form */}
              {activeTab === 'profil' && (
                <form onSubmit={handleProfilProdiSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Profil Program Studi</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sejarah
                    </label>
                    <textarea
                      value={profilProdiForm.sejarah}
                      onChange={(e) => setProfilProdiForm({ ...profilProdiForm, sejarah: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Visi
                    </label>
                    {profilProdiForm.visi.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateVisi(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                        {profilProdiForm.visi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVisi(index)}
                            className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVisi}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                      + Tambah Visi
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Misi
                    </label>
                    {profilProdiForm.misi.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateMisi(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                          required
                        />
                        {profilProdiForm.misi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMisi(index)}
                            className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMisi}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                      + Tambah Misi
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Dokumen Akreditasi - Detail
                    </label>
                    <textarea
                      value={profilProdiForm.dokumen_akreditasi_detail}
                      onChange={(e) => setProfilProdiForm({ ...profilProdiForm, dokumen_akreditasi_detail: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Dokumen Akreditasi - URL Gambar
                    </label>
                    <input
                      type="url"
                      value={profilProdiForm.dokumen_akreditasi_gambar}
                      onChange={(e) => setProfilProdiForm({ ...profilProdiForm, dokumen_akreditasi_gambar: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </m.div>
          )}

          {/* Empty State */}
          {!showForm && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                {activeTab === 'berita' ? '📰' : activeTab === 'dosen' ? '👨‍🏫' : activeTab === 'carousel' ? '🎠' : '🏫'}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Belum ada data {activeTab === 'berita' ? 'berita' : activeTab === 'dosen' ? 'dosen' : activeTab === 'carousel' ? 'carousel' : 'profil'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Klik tombol "Tambah" di atas untuk menambahkan data baru
              </p>
            </div>
          )}
        </div>
      </m.div>
    </div>
  </div>
  );
}

export default Admin;
