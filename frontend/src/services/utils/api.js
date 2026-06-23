import axios from "axios";
import { env } from "../utils/env";

const api = axios.create({
  baseURL: `${env.BACKEND_URL}/${env.BACKEND_VERSION}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    //
    return response;
  },
  (error) => {
    const errorData = error.response?.data;
    const statusCode = error.response?.status;
    const errorMessage =
      errorData?.message || error.message || "Something went wrong";

    // console.error("❌ API Error:", {
    //   url: error.config?.url,
    //   status: statusCode,
    //   message: errorMessage,
    //   errors: errorData?.errors,
    //   isOperational: errorData?.isOperational,
    // });

    if (statusCode === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/admin") ||
        error.config?.url?.includes("/auth/me");

      if (!isAuthEndpoint) {

        // setTimeout(() => {
        //   window.location.href = "/login";
        // }, 1000);
      }
    }

    if (statusCode === 403) {

      setTimeout(() => {
        window.location.href = "/no-access";
      }, 1000);
    }

    if (statusCode === 404) {

    }

    if (statusCode === 409) {

    }

    if (statusCode >= 500) {

    }

    return Promise.reject(error);
  },
);

export default api;
