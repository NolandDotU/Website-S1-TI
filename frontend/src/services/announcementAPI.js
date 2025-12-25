import api from "./utils/api";

export const getAnnouncements = async (page = 1, limit = 100, search = "") => {
  try {
    const response = await api.get("/announcements", {
      params: { page, limit },
    });
    return {
      announcements: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    throw error;
  }
};

export const adminGetAnnouncements = async (
  page = 1,
  limit = 100,
  search = ""
) => {
  try {
    const response = await api.get("/announcements/admin", {
      params: { page, limit, search },
    });
    return {
      announcements: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    const response = await api.post("/announcements/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      path: response.data.path,
      filename: response.data.filename,
    };
  } catch (error) {
    throw error;
  }
};
