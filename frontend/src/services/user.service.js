import api from "./utils/api";

const getAllUser = async (page = 1, limit = 25, search = "") => {
  try {
    const response = await api.get(
      `/user?page=${page}&limit=${limit}&search=${search}`,
    );
    console.log("response get all user", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const newUser = async (data) => {
  try {
    const response = await api.post("/user", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (data) => {
  try {
    const response = await api.patch(`/user/password`, data);
    return response.data;
  } catch (error) {
    console.error("error response : ", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const nonActivateUser = async (id) => {
  try {
    const response = await api.patch(`/user/nonactivate/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const activateUser = async (id) => {
  try {
    const response = await api.patch(`/user/activate/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllUser,
  newUser,
  updateUser,
  deleteUser,
  nonActivateUser,
  activateUser,
  updatePassword,
};
