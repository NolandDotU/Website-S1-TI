export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BACKEND_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : process.env.REACT_APP_BACKEND_URL,
  URL_LOGIN_GOOGLE:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api/v1/auth/google"
      : process.env.REACT_APP_URL_LOGIN_GOOGLE,
  BACKEND_VERSION: process.env.REACT_APP_BACKEND_URL_VERSION,
  IMAGE_BASE_URL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BACKEND_URL
      : "",
};
