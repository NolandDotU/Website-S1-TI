import axios from "axios";
import React from "react";
import { Navigate, Routes } from "react-router-dom";

const ProtectedRoute = async ({ children }) => {
  console.log("Checking authentication for protected route...");
  try {
    const isAuthenticated = await axios.get("/api/v1/auth/admin");
    console.log(isAuthenticated);
    if (isAuthenticated.status !== 200) {
      return <Navigate to="/no-access" />;
    }
  } catch (error) {
    console.log("Not authenticated:", error);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
