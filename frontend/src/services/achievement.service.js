import api from "./utils/api";

export const getAchievements = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await api.get(
      `/achievements?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAchievementById = async (id) => {
  try {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAchievement = async (data) => {
  try {
    const response = await api.post("/achievements", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAchievement = async (data, id) => {
  try {
    const response = await api.put(`/achievements/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAchievement = async (id) => {
  try {
    const response = await api.delete(`/achievements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadAchievementImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post("/achievements/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadAchievementCertificate = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/achievements/uploads/certificate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
