import api from "./utils/api";

export const getAllKnowledge = async (params = {}) => {
  try {
    const response = await api.get("/knowledge", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKnowledgeById = async (id) => {
  try {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createKnowledge = async (payload) => {
  try {
    const response = await api.post("/knowledge", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateKnowledge = async (id, payload) => {
  try {
    const response = await api.put(`/knowledge/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteKnowledge = async (id) => {
  try {
    const response = await api.delete(`/knowledge/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
