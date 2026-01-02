import api from "./utils/api";

export const getLecturers = async (page = 1, limit = 100, search = "") => {
  try {
    const response = await api.get(
      `/lecturers?page=${page}&limit=${limit}&search=${search}`
    );
    console.log("API response for getLecturers:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers:", error);
  }
};

export const createLecturer = async (lecturerData) => {
  try {
    const response = await api.post("/lecturers", lecturerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLecturer = async (lecturerId, lecturerData) => {
  try {
    const response = await api.put(`/lecturers/${lecturerId}`, lecturerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLecturer = async (lecturerId, url) => {
  try {
    console.log("Deleting lecturer with ID:", lecturerId);
    const response = await api.delete(`/lecturers/${lecturerId}`, {
      photo: url,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPhoto = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append("photo", photoFile);
    const response = await api.post("/lecturers/uploads", formData, {
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
