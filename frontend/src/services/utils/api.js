import axios from "axios";
import { env } from "../utils/env";
import { useToast } from "../../context/toastProvider";

// ✅ Base Axios Instance
// ✅ Axios instance dengan withCredentials
const api = axios.create({
  baseURL: `${env.BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Axios interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.config.url, response.status);
    return response;
  },
  (error) => {
    // ✅ Extract error message dari ApiError format
    const errorData = error.response?.data;
    const statusCode = error.response?.status;
    const errorMessage =
      errorData?.message || error.message || "Something went wrong";

    console.error("❌ API Error:", {
      url: error.config?.url,
      status: statusCode,
      message: errorMessage,
      errors: errorData?.errors,
      isOperational: errorData?.isOperational,
    });

    // Handle specific error codes
    if (statusCode === 401) {
      // Jangan redirect kalau endpoint login/auth
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/admin") ||
        error.config?.url?.includes("/auth/google") ||
        error.config?.url?.includes("/auth/me");

      if (!isAuthEndpoint) {
        console.log(
          "🔐 Unauthorized - Session expired, redirecting to login..."
        );
        // setTimeout(() => {
        //   window.location.href = "/login";
        // }, 1000);
      }
    }

    if (statusCode === 403) {
      console.log("🚫 Forbidden - Access denied, redirecting to no-access...");
      setTimeout(() => {
        window.location.href = "/no-access";
      }, 1000);
    }

    if (statusCode === 404) {
      console.log("❓ Not Found - Resource does not exist");
    }

    if (statusCode === 409) {
      console.log("⚠️ Conflict - Resource already exists");
    }

    if (statusCode >= 500) {
      console.log("💥 Server Error - Internal server error");
    }

    return Promise.reject(error);
  }
);

export default api;
