export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BACKEND_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : process.env.REACT_APP_BACKEND_URL,
  BACKEND_VERSION: process.env.REACT_APP_BACKEND_URL_VERSION || "v1",
  IMAGE_BASE_URL:
    process.env.NODE_ENV === "development" ? "http://localhost:5000" : "",
};
