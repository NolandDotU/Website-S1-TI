import api from "./utils/api";

export const getAllHistory = async (limit = 50, page = 1, search = "") => {
  try {
    const response = await api.get(
      `/history/?limit=${limit}&page=${page}&search=${search}`
    );
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
