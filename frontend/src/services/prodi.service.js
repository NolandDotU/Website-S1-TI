import api from "./utils/api";

export const getProdiProfile = async () => {
  const response = await api.get("/prodi");
  return response.data;
};

export const updateProdiProfile = async (payload) => {
  const response = await api.put("/prodi", payload);
  return response.data;
};

export const uploadProdiSertifikat = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  
  const response = await api.post("/prodi/sertifikat", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
