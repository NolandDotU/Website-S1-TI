import api from "./utils/api";
export const getAllHistory = async (
  limit = 50,
  page = 1,
  search = "",
  user,
) => {
  const isAdmin = user.role === "admin" ? true : false;
  try {
    let response;
    if (isAdmin) {
      response = await api.get(
        `/history/?limit=${limit}&page=${page}&search=${search}`,
      );
    }
    response = await api.get(
      `/history/user/?limit=${limit}&page=${page}&search=${search}`,
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
