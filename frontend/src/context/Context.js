import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { env } from "../services/utils/env";
import api from "../services/utils/api";
import { useToast } from "./toastProvider";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Check if user is authenticated via /auth/me endpoint
  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      // ✅ Handle backend ApiResponse format
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        setUser(null);
        console.log("❌ User not authenticated");
      }
    } catch (error) {
      // console.error(
      // "❌ Auth check failed:",
      // error.response?.data?.message || error.message,
      // );
      // toast.error(`${error.response?.data?.message || error.message}`);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin login
  const localLogin = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      // ✅ Handle backend ApiResponse format
      if (data.success) {
        // Re-check auth to get user data
        await checkAuth();
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Network error";
      const errorDetails = error.response?.data?.errors || [];

      console.error("❌ Login error:", {
        message: errorMessage,
        errors: errorDetails,
        statusCode: error.response?.status,
      });

      return {
        success: false,
        error: errorMessage,
        errors: errorDetails,
      };
    }
  };

  const updateUser = async (id, data) => {
    try {
      const response = await api.put(`/user/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Google OAuth
  const loginWithGoogle = () => {
    window.location.href = `${env.BACKEND_URL}/api/v1/auth/google`;
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force redirect even if API fails
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    loading,
    checkAuth,
    localLogin,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
