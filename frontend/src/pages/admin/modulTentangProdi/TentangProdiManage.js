import React, { useState, useEffect } from "react";
import { getProdiProfile, updateProdiProfile, uploadProdiSertifikat } from "../../../services/api";
import { useToast } from "../../../context/toastProvider";

const TentangProdiManage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    accreditationText: "",
    sertifikatUrl: "",
    visi: "",
    misi: [""],
    peminatan: [{ title: "", description: "" }],
    profilLulusan: [{ title: "", desc: "" }],
    kurikulum: {
      title: "",
      sk: "",
      perubahanUtama: [{ title: "", description: "" }],
      strategiPembelajaran: [{ tahun: "", description: "" }],
      notes: ""
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getProdiProfile();
      const data = response?.data || response;
      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          accreditationText: data.accreditationText || "",
          sertifikatUrl: data.sertifikatUrl || "",
          visi: data.visi || "",
          misi: data.misi?.length ? data.misi : [""],
          peminatan: data.peminatan?.length ? data.peminatan : [{ title: "", description: "" }],
          profilLulusan: data.profilLulusan?.length ? data.profilLulusan : [{ title: "", desc: "" }],
          kurikulum: data.kurikulum || {
            title: "",
            sk: "",
            perubahanUtama: [{ title: "", description: "" }],
            strategiPembelajaran: [{ tahun: "", description: "" }],
            notes: ""
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProdiProfile(formData);
      toast.success("Profil Prodi berhasil disimpan!", {
        duration: 3000,
        position: "top-center"
      });
    } catch (err) {
      toast.error("Gagal menyimpan profil prodi.", {
        duration: 3000,
        position: "top-center"
      });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSertifikat = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.success("Mengunggah sertifikat...");
      const response = await uploadProdiSertifikat(file);
      const url = response?.data?.url || response?.url;
      if (url) {
        setFormData({ ...formData, sertifikatUrl: url });
        toast.success("Sertifikat berhasil diunggah! Jangan lupa simpan perubahan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunggah sertifikat.");
    }
  };

  // Generic handlers for arrays
  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    if (key === null) {
      newArray[index] = value; // For strings array like misi
    } else {
      newArray[index][key] = value; // For objects array
    }
    setFormData({ ...formData, [field]: newArray });
  };

  const handleNestedArrayChange = (field, arrayName, index, key, value) => {
    const newArray = [...formData[field][arrayName]];
    newArray[index][key] = value;
    setFormData({
      ...formData,
      [field]: { ...formData[field], [arrayName]: newArray }
    });
  };

  const addNestedArrayItem = (field, arrayName, emptyItem) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], [arrayName]: [...formData[field][arrayName], emptyItem] }
    });
  };

  const removeNestedArrayItem = (field, arrayName, index) => {
    const newArray = formData[field][arrayName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: { ...formData[field], [arrayName]: newArray }
    });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData({ ...formData, [field]: [...formData[field], emptyItem] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Tentang Program Studi</h2>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {["general", "visi-misi", "peminatan", "profil-lulusan", "kurikulum"].map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 font-semibold whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {activeTab === "general" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Utama</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Utama</label>
              <textarea
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teks Akreditasi</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={formData.accreditationText}
                onChange={e => setFormData({ ...formData, accreditationText: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Sertifikat Akreditasi</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  onChange={handleUploadSertifikat}
                />
                {formData.sertifikatUrl && (
                  <img src={`${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:4738'}${formData.sertifikatUrl}`} alt="Sertifikat" className="h-16 w-auto object-cover rounded border" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Sertifikat akan digunakan pada halaman Tentang Prodi. Maks 5MB.</p>
            </div>
          </div>
        )}

        {activeTab === "visi-misi" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visi</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={formData.visi}
                onChange={e => setFormData({ ...formData, visi: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Misi</label>
              {formData.misi.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="py-2 text-gray-500">{index + 1}.</span>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={item}
                    onChange={e => handleArrayChange("misi", index, null, e.target.value)}
                  />
                  <button onClick={() => removeArrayItem("misi", index)} className="text-red-500 p-2 hover:bg-red-50 rounded">X</button>
                </div>
              ))}
              <button 
                onClick={() => addArrayItem("misi", "")}
                className="mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                + Tambah Misi
              </button>
            </div>
          </div>
        )}

        {activeTab === "peminatan" && (
          <div>
            <p className="text-gray-500 mb-4 text-sm">Kelola daftar bidang peminatan studi.</p>
            {formData.peminatan.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 mb-4 relative">
                <button onClick={() => removeArrayItem("peminatan", index)} className="absolute top-2 right-2 text-red-500 font-bold hover:bg-red-100 p-1 rounded">X</button>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Nama Peminatan</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={item.title}
                    onChange={e => handleArrayChange("peminatan", index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={item.description}
                    onChange={e => handleArrayChange("peminatan", index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button 
                onClick={() => addArrayItem("peminatan", {title: "", description: ""})}
                className="mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                + Tambah Peminatan
              </button>
          </div>
        )}

        {activeTab === "profil-lulusan" && (
          <div>
            <p className="text-gray-500 mb-4 text-sm">Kelola daftar profil lulusan studi.</p>
            {formData.profilLulusan.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 mb-4 relative">
                <button onClick={() => removeArrayItem("profilLulusan", index)} className="absolute top-2 right-2 text-red-500 font-bold hover:bg-red-100 p-1 rounded">X</button>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Profesi/Peran</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={item.title}
                    onChange={e => handleArrayChange("profilLulusan", index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Deskripsi Pekerjaan</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={item.desc}
                    onChange={e => handleArrayChange("profilLulusan", index, "desc", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button 
                onClick={() => addArrayItem("profilLulusan", {title: "", desc: ""})}
                className="mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                + Tambah Profil Lulusan
              </button>
          </div>
        )}

        {activeTab === "kurikulum" && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Informasi Umum Kurikulum</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Kurikulum</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.kurikulum.title}
                  onChange={e => setFormData({ ...formData, kurikulum: { ...formData.kurikulum, title: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SK Rektor (Deskripsi Singkat)</label>
                <textarea
                  rows={2}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.kurikulum.sk}
                  onChange={e => setFormData({ ...formData, kurikulum: { ...formData.kurikulum, sk: e.target.value } })}
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Perubahan Utama</h3>
              {formData.kurikulum.perubahanUtama.map((item, index) => (
                <div key={index} className="mb-4 pl-4 border-l-2 border-blue-500 relative">
                  <button onClick={() => removeNestedArrayItem("kurikulum", "perubahanUtama", index)} className="absolute -top-1 right-0 text-red-500 font-bold hover:bg-red-100 p-1 rounded">X</button>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Judul Perubahan</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={item.title}
                      onChange={e => handleNestedArrayChange("kurikulum", "perubahanUtama", index, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                    <textarea
                      rows={2}
                      className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={item.description}
                      onChange={e => handleNestedArrayChange("kurikulum", "perubahanUtama", index, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addNestedArrayItem("kurikulum", "perubahanUtama", {title: "", description: ""})}
                className="mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                + Tambah Perubahan Utama
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Strategi Pembelajaran Bertahap</h3>
              {formData.kurikulum.strategiPembelajaran.map((item, index) => (
                <div key={index} className="mb-4 flex gap-4 items-start relative">
                  <div className="w-1/3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Tahun/Fase</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={item.tahun}
                      onChange={e => handleNestedArrayChange("kurikulum", "strategiPembelajaran", index, "tahun", e.target.value)}
                      placeholder="e.g. Tahun 1"
                    />
                  </div>
                  <div className="w-full relative">
                    <button onClick={() => removeNestedArrayItem("kurikulum", "strategiPembelajaran", index)} className="absolute -top-6 right-0 text-red-500 font-bold hover:bg-red-100 p-1 rounded">X</button>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={item.description}
                      onChange={e => handleNestedArrayChange("kurikulum", "strategiPembelajaran", index, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addNestedArrayItem("kurikulum", "strategiPembelajaran", {tahun: "", description: ""})}
                className="mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                + Tambah Tahap
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Catatan Tambahan (Pengembangan Holistik)</h3>
              <textarea
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.kurikulum.notes}
                onChange={e => setFormData({ ...formData, kurikulum: { ...formData.kurikulum, notes: e.target.value } })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TentangProdiManage;
