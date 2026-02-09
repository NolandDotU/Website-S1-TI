import React, { useState, useEffect } from "react";
import ftiLogo from "../assets/logo/logoFTI-CNN7ms1i.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/Context";
import { useToast } from "../context/toastProvider";
import loginIllustration from "../assets/illustration/login.svg";
import googleIcon from "../assets/icon/google-icon.svg";
import { env } from "../services/utils/env";

const Login = () => {
  const navigate = useNavigate();
  const { user, localLogin, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "hmp") {
        navigate("/cms/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await localLogin(
        credentials.username,
        credentials.password,
      );
      console.log("login result ", result);

      if (result.success) {
        toast.success("Login successful! Redirecting...");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google...");
    console.log("Redirecting to Google...", env.URL_LOGIN_GOOGLE);
    setTimeout(() => {
      loginWithGoogle();
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 
              hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>

          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg overflow-hidden mb-4">
              <img
                src={ftiLogo}
                alt="FTI Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Hallo,
              <br />
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Hey, welcome back to your special place
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                  focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 
                  transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
                placeholder="username"
              />
            </div>

            <div>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                  focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 
                  transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                dark:from-blue-500 dark:to-blue-600 text-white font-semibold 
                rounded-xl transition-all shadow-md ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700"
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

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="mx-3 text-gray-400 dark:text-gray-500 text-sm">
                Or Sign in with
              </span>
              <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 border 
                border-gray-200 dark:border-gray-700 rounded-xl 
                hover:bg-gray-50 dark:hover:bg-gray-800 transition-all 
                disabled:opacity-50 bg-white dark:bg-gray-800">
              <img src={googleIcon} alt="Google" className="w-6 h-6" />
            </button>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 
          to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 
          items-center justify-center p-12 relative overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-20 right-0 w-96 h-96 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute bottom-0 left-20 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />

        {/* Main Illustration */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 flex items-center justify-center">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-w-lg w-full h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Decorative Elements */}
        <div
          className="absolute top-20 left-20 w-16 h-16 border-4 border-white/20 
          rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-32 right-32 w-20 h-20 border-4 border-white/20 
          rounded-lg rotate-45 animate-pulse"
          style={{ animationDelay: "1s" }}></div>
      </motion.div>
    </div>
  );
};

export default Login;
