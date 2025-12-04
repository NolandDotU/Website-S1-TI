import dotenv from "dotenv";

dotenv.config();

/**
 * Get environment variable with validation
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value
 */
export const getEnv = (key, defaultValue = null) => {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value || defaultValue;
};

export const validateEnv = () => {
  const required = ["MONGO_URI", "NODE_ENV"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

export const paginate = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

export const apiResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return response;
};
