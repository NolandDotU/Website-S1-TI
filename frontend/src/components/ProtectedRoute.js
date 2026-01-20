import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Context";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  try {
    // ✅ Show loading state while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
              Checking authentication...
            </p>
          </div>
        </div>
      );
    }

    // ✅ Redirect to login if not authenticated
    if (!user) {
      console.log(
        "ProtectedRoute - User not authenticated, redirecting to /login",
        user,
      );
      return <Navigate to="/login" replace />;
    }

    // ✅ Check role if required (e.g., admin only)
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/no-access" replace />;
    }

    // ✅ User is authenticated and authorized
    return children;
  } catch (error) {
    console.error("ProtectedRoute - Error during authentication check:", error);
    return <Navigate to="/login" replace />; // Fallback to login on error
  }
};

export default ProtectedRoute;
