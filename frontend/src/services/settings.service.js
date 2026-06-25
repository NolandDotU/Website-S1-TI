import api from "./utils/api";

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await api.put("/settings", payload);
  return response.data;
};

export const updatePassword = async (payload) => {
  const response = await api.patch("/user/password", payload);
  return response.data;
};

export const updateAdminProfile = async (id, payload) => {
  const response = await api.put(`/user/${id}`, payload);
  return response.data;
};
