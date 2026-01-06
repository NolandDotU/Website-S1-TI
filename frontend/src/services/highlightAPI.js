import api from "./utils/api";

export const getAllHighlight = async () => {
  try {
    const response = await api.get("/highlight/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createHighlight = async (data) => {
  try {
    const response = await api.post("/highlight/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateHighlight = async (id, data) => {
  try {
    const response = await api.put(`/highlight/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHighlight = async (id) => {
  try {
    const response = await api.delete(`/highlight/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearHighlight = async () => {
  try {
    const response = await api.delete("/highlight/clear");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPhoto = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append("photo", photoFile);
    const response = await api.post("/highlight/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};
