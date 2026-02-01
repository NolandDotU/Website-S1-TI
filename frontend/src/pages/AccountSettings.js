import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, User, Mail, Shield, GlobeLock } from "lucide-react";
import { useAuth } from "../context/Context";
import { updatePassword, updateUser } from "../services/user.service";
import { useToast } from "../context/toastProvider";
const AccountSettings = () => {
  const { user, checkAuth } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    fullname: user?.fullname || "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fetch = async () => {
    try {
      const response = await checkAuth();
      console.log("RESPONSE ", response);
      if (response) {
        setProfileData({
          username: response.username,
          fullname: response.fullname,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Handle Profile Changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    checkAuth();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await updateUser(user.id, profileData);
      console.log("RESPONSE : ", response);
      if (response.statusCode !== 200) throw new Error(response.message);

      if (updateUser) {
        setProfileData({
          ...user,
          username: profileData.username,
          fullname: profileData.fullname,
        });
      }

      toast.success("Profil berhasil diperbarui");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
      console.error("Error updating profile:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileData({
      username: user?.username || "",
      fullname: user?.fullname || "",
    });
    setIsEditingProfile(false);
  };

  // Handle Password Changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await updatePassword(passwordData);
      if (response.statusCode !== 200) throw new Error(response.message);

      toast.success("Password berhasil diperbarui");

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui password",
      );
      console.error("Error updating password:", error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Lemah", color: "bg-red-500" };
    if (strength <= 3)
      return { strength, label: "Sedang", color: "bg-yellow-500" };
    return { strength, label: "Kuat", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-20 dark:opacity-30"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-block mb-4 px-6 py-2 bg-white bg-opacity-20 dark:bg-opacity-10 rounded-full border border-white border-opacity-30">
            <span className="text-sm font-semibold tracking-wide">
              PENGATURAN AKUN
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Keamanan & Profil
          </h1>
          <p className="text-base md:text-lg opacity-90 dark:opacity-80">
            Kelola informasi akun dan keamanan Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Account Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Informasi Profil
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Perbarui username dan nama lengkap Anda
                  </p>
                </div>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors text-sm">
                  Edit Profil
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </label>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 flex items-center justify-between">
                    <span>{user?.email}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                      Tidak dapat diubah
                    </span>
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      required
                      minLength={4}
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan username"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                      {profileData.username}
                    </div>
                  )}
                </div>

                {/* Fullname */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      name="fullname"
                      value={profileData.fullname}
                      onChange={handleProfileChange}
                      required
                      minLength={4}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan nama lengkap"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                      {profileData.fullname || "Nama Lengkap"}
                    </div>
                  )}
                </div>

                {/* Role (Read-only) */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Role
                      </div>
                    </label>
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <GlobeLock className="w-4 h-4" />
                        Provider Akun
                      </div>
                    </label>
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        {user?.authProvider?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditingProfile && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelProfile}
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="flex-1 px-4 py-3 bg-blue-700 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSavingProfile ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Password Security Card */}

          {user?.authProvider !== "google" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-700 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Keamanan Password
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Perbarui password Anda secara berkala untuk keamanan akun
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password Saat Ini{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Masukkan password saat ini"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          {showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password Baru <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Masukkan password baru (min. 8 karakter)"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordData.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Kekuatan Password:
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                passwordStrength.strength <= 2
                                  ? "text-red-600 dark:text-red-400"
                                  : passwordStrength.strength <= 3
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-green-600 dark:text-green-400"
                              }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{
                                width: `${(passwordStrength.strength / 5) * 100}%`,
                              }}></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Gunakan kombinasi huruf besar, kecil, angka, dan
                            simbol
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Konfirmasi Password Baru{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Ulangi password baru"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Password tidak cocok
                          </p>
                        )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={
                          isSavingPassword ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                        }
                        className="w-full px-4 py-3 bg-red-700 dark:bg-red-600 text-white rounded-lg font-semibold hover:bg-red-800 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {isSavingPassword ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memperbarui Password...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Perbarui Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 p-6 rounded">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-2">
                      Tips Keamanan
                    </h3>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                      <li>• Gunakan password yang unik dan kuat</li>
                      <li>
                        • Jangan gunakan password yang sama dengan akun lain
                      </li>
                      <li>• Perbarui password secara berkala</li>
                      <li>• Jangan bagikan password Anda kepada siapapun</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
