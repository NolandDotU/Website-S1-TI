import api from "./utils/api";
export const getAllPartner = async () => {
  try {
    const response = await api.get("/partners");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPartner = async (partner) => {
  try {
    const response = await api.post("/partners", partner);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPartnerImage = async (formData) => {
  try {
    const response = await api.post("/partners/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editPartner = async (id, partner) => {
  try {
    const response = await api.put(`/partners/${id}`, partner);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePartner = async (id) => {
  try {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
