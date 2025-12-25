import React, { useState, useEffect } from "react";
import ftiLogo from "../assets/logoFTI-CNN7ms1i.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/Context";
import { useToast } from "../components/toastProvider"; // ← Import toast

const Login = () => {
  const navigate = useNavigate();
  const { user, loginAdmin, loginWithGoogle } = useAuth();
  const toast = useToast(); // ← Use toast

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  // ✅ Redirect jika sudah login
  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.username}!`);
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  // ✅ Handle admin login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAdmin(
        credentials.username,
        credentials.password
      );
      console.log("Login result:", result);

      if (result.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } else {
        console.error("Login failed:", result.error);
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google login
  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google...");
    setTimeout(() => {
      loginWithGoogle();
    }, 500);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeInOut" },
        },
      }}
      className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="mx-auto w-full max-w-md px-4 py-8 text-center lg:py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src={ftiLogo}
              alt="FTI Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
          className="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-4xl">
          Admin Portal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
          className="mb-8 text-base font-medium text-gray-500 dark:text-gray-400">
          Teknik Informatika UKSW
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6 text-left">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField("")}
              required
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                focusedField === "username"
                  ? "border-blue-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              placeholder="Enter your username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              required
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                focusedField === "password"
                  ? "border-blue-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold rounded-xl transition-all shadow-lg text-base uppercase tracking-wide ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-blue-900 hover:shadow-xl"
            }`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="mx-3 text-gray-400 text-xs font-semibold uppercase">
              or
            </span>
            <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg font-bold text-gray-700 dark:text-gray-200 transition-all text-base ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl"
            }`}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              className="w-6 h-6"
            />
            Sign in with Google
          </button>
        </motion.form>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
          className="mt-8">
          <p className="text-xs text-gray-400 text-center">
            Secure admin access only
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Protected by HttpOnly Cookies</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Login;
