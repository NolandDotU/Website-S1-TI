import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Database,
  X,
  Save,
} from "lucide-react";
import {
  createKnowledge,
  deleteKnowledge,
  getAllKnowledge,
  updateKnowledge,
} from "../../../services/knowledge.service";
import { useToast } from "../../../context/toastProvider";

const emptyForm = {
  kind: "contact",
  title: "",
  content: "",
  link: "",
  synonymsText: "",
};

const KnowledgeManagement = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const queryParams = useMemo(() => {
    const params = { page, limit: 10 };
    if (search.trim()) params.search = search.trim();
    if (kind !== "all") params.kind = kind;
    return params;
  }, [search, kind, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllKnowledge(queryParams);
      setItems(response?.data?.items || []);
      setMeta(response?.data?.meta || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal memuat knowledge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryParams]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      kind: item.kind,
      title: item.title,
      content: item.content,
      link: item.link || "",
      synonymsText: (item.synonyms || []).join(", "),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.title.trim()) {
      toast.error("Title wajib diisi");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Content wajib diisi");
      return;
    }

    const payload = {
      kind: form.kind,
      title: form.title.trim(),
      content: form.content.trim(),
      link: form.link.trim(),
      synonyms: form.synonymsText
        .split(",")
        .map((text) => text.trim())
        .filter(Boolean),
    };

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateKnowledge(editingItem.id, payload);
        toast.success("Knowledge berhasil diupdate");
      } else {
        await createKnowledge(payload);
        toast.success("Knowledge berhasil dibuat");
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gagal menyimpan knowledge",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Hapus knowledge ini?");
    if (!ok) return;

    try {
      await deleteKnowledge(id);
      toast.success("Knowledge berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menghapus knowledge");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Knowledge Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kelola data kontak dan layanan untuk RAG chatbot
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Knowledge
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Cari title/content/sinonim..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={kind}
          onChange={(e) => {
            setPage(1);
            setKind(e.target.value);
          }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="all">Semua Jenis</option>
          <option value="contact">Contact</option>
          <option value="service">Service</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900 dark:text-white">
            Daftar Knowledge
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total: {meta?.total || 0}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            Memuat data...
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <Database className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada data knowledge
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <div
                key={item.id}
                className="px-4 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] uppercase px-2 py-1 rounded-full font-semibold ${
                        item.kind === "contact"
                          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}>
                      {item.kind}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {item.content}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 mt-1 inline-block hover:underline">
                      {item.link}
                    </a>
                  )}
                  {(item.synonyms || []).length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                      Sinonim: {item.synonyms.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {meta?.totalPage > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50">
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} / {meta.totalPage}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
            disabled={page >= meta.totalPage}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingItem ? "Edit Knowledge" : "Tambah Knowledge"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Jenis
                </label>
                <select
                  value={form.kind}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, kind: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <option value="contact">Contact</option>
                  <option value="service">Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Contoh: Kontak FTI UKSW"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Content
                </label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Isi informasi utama knowledge..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Link (opsional)
                </label>
                <input
                  value={form.link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Sinonim (pisahkan dengan koma)
                </label>
                <input
                  value={form.synonymsText}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      synonymsText: e.target.value,
                    }))
                  }
                  placeholder="email fti, kontak fti, telepon fti"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50">
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeManagement;
