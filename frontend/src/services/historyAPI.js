import api from "./utils/api";

export const getAllHistory = async () => {
  try {
    const response = await api.get("/history/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHistoryByUser = async () => {
  try {
    const response = await api.get("/history/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};
