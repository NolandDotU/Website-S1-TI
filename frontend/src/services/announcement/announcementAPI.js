import { Trophy } from "lucide-react";
import api from "../utils/api";

//===================
//GET DATA ANNOUCEMENT
//===================
export const getAnnouncements = async (page = 1, limit = 100, search = "") => {
  try {
    const response = await api.get("/announcements", {
      params: { page, limit },
    });
    console.log("RESPONSE GET: ", response);
    return {
      announcements: response.data.data.announcements || [],
      meta: response.data.data.meta || {},
    };
  } catch (error) {
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`/announcement/${id}`);
    return response.data;
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
      announcements: response.data.data.announcements || [],
      meta: response.data.data.meta || {},
    };
  } catch (error) {
    throw error;
  }
};

//==============
//UPLOAD IMAGE
//==============
export const uploadImage = async (photo) => {
  try {
    const formData = new FormData();
    formData.append("photo", photo);
    const response = await api.post("/announcements/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//=============
//POST NEW ANNOUNNCEMENT
//=============
export const createAnnouncement = async (announcementData) => {
  try {
    if (announcementData.photo !== null) {
      uploadImage(announcementData.photo);
    }
    const response = await api.post("/announcements", announcementData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//===========
//UPDATE STATUS ANNOUCEMENT ["PUBLISHED", "DRAFT", "ARCHIVED"]
//===========
export const changeStatus = async (status, id) => {
  try {
    const response = await api.patch(`/announcements/:id/:status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//===========
//UPDATE ANNOUCEMENT
//===========
export const update = async (formData, id) => {
  try {
    const response = await api.put("/announcements/:id", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//===========
//DELETE ANNOUNCEMENT
//===========
export const delAnnouncement = async (id) => {
  try {
    const response = await api.delete(`/announcements/:id`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
