import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import ModalConfirmation from "../../../components/Admin/ModalConfirmation";
import { UserModal } from "../../../components/Admin/users/UserModal";
import {
  getAllUser,
  newUser,
  nonActivateUser,
  updateUser,
  activateUser,
} from "../../../services/api";
import { useToast } from "../../../context/toastProvider";

export const UserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNonActivateModal, setIsNonActivateModal] = useState(false);
  const [isActivateModal, setIsActivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllUser(page, limit, search);
      setUsers(response.data.users);
      setTotalPages(response.data.meta.totalPage);

      if (response.statusCode !== 200)
        console.log("response data user", response);
    } catch (error) {
      console.log(error);
      toast.error(`Terjadi kesalahan ${error.response?.data?.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleNonActivate = (user) => {
    setSelectedUser(user);
    setIsNonActivateModal(true);
  };

  const handleActivate = (user) => {
    setSelectedUser(user);
    setIsActivateModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  const handleSave = async (userData) => {
    try {
      let response;
      if (modalMode === "create") {
        response = await newUser(userData);
        console.log("create response : ", response);
        if (response.data.meta.statusCode !== 201)
          return toast.error(
            `Gagal menambah user baru! (${response.data.message})`,
          );
        setUsers([...users, { ...userData, id: Date.now().toString() }]);
        fetchData();
      } else {
        console.log("selected user : ", selectedUser);

        response = await updateUser(selectedUser._id, userData);
        console.log("response update : ", response);
        if (response.statusCode !== 200)
          toast.error(`Gagal memperbarui user ${response.data.message}`);
        setUsers(
          users.map((u) =>
            u._id === selectedUser._id ? { ...u, ...userData } : u,
          ),
        );
        fetchData();
      }
      toast.success(`${response.message}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Terjadi kesalahan server!");
    }

    setIsModalOpen(false);
  };

  const changeStatus = async (isActive) => {
    try {
      const response = isActive
        ? await activateUser(selectedUser.id || selectedUser._id)
        : await nonActivateUser(selectedUser.id || selectedUser._id);
      if (response.statusCode !== 200)
        return toast.error("Gagal mengubah status user!");
      toast.success("Berhasil mengubah status user");
      users.map((u) =>
        u._id === selectedUser._id ? { ...u, isActive: isActive } : u,
      );

      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan server!");
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isActive: u.isActive } : u)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data pengguna sistem
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
            transition-colors font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Tambah User
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, username, atau email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
              dark:border-gray-700 bg-white dark:bg-gray-900 
              text-gray-900 dark:text-white placeholder-gray-400 
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
              transition-colors"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Memuat data user...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 
                        flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {search
                          ? "Tidak ada hasil pencarian"
                          : "Belum ada data user"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                        {search
                          ? `Tidak ditemukan user dengan kata kunci "${search}"`
                          : "Mulai tambahkan user baru dengan klik tombol Tambah User"}
                      </p>
                      {!search && (
                        <button
                          onClick={handleCreate}
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                            dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg 
                            transition-colors font-medium shadow-md hover:shadow-lg">
                          <Plus className="w-5 h-5" />
                          Tambah User Pertama
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id || user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                          flex items-center justify-center text-white font-semibold">
                          {user.fullname?.charAt(0) ||
                            user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.fullname || user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-white">
                          {user.email}
                        </span>
                        {user.isEmailVerified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : user.role === "user"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-white capitalize">
                        {user.authProvider}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id || user._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
                        }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="Edit User"
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 
                            dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.isActive ? (
                          <button
                            title="Non-Activate User"
                            onClick={() => handleNonActivate(user)}
                            className="p-2 text-orange-600 hover:bg-red-50 dark:text-orange-400 
                            dark:hover:bg-orange-900/30 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            title="Activate User"
                            onClick={() => handleActivate(user)}
                            className="p-2 text-green-600 hover:bg-red-50 dark:text-green-400 
                            dark:hover:bg-green-900/30 rounded-lg transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          title="Permanent Delete User"
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 
                            dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            user={selectedUser}
            mode={modalMode}
          />
        )}

        {isDeleteModalOpen && (
          <ModalConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Konfirmasi Penghapusan!"
            message={`Anda yakin ingin menghapus user ${selectedUser?.fullname || selectedUser?.username}?`}
          />
        )}

        {isNonActivateModal && (
          <ModalConfirmation
            isOpen={isNonActivateModal}
            onClose={() => setIsNonActivateModal(false)}
            onConfirm={() => changeStatus(false)}
            title="Korfirmasi Non-Aktivasi User!"
            message={`Anda yakin ingin menonaktifkan user ${selectedUser?.fullname || selectedUser?.username}`}
          />
        )}
        {isActivateModal && (
          <ModalConfirmation
            isOpen={isActivateModal}
            onClose={() => setIsActivateModal(false)}
            onConfirm={() => changeStatus(true)}
            title="Korfirmasi Aktivasi User!"
            message={`Anda yakin ingin mengaktifkan user ${selectedUser?.fullname || selectedUser?.username}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
