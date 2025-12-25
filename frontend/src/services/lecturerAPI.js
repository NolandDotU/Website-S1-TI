import api from "./utils/api";

export const getLecturers = async (page = 1, limit = 100) => {
  try {
    const response = await api.get(`/lecturers?page=${page}&limit=${limit}`);
    return {
      lecturers: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    console.error("Error fetching lecturers:", error);
  }
};
