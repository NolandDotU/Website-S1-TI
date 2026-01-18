// API service layer
import { partners } from "../data/partners";
import { services } from "../data/services";
import { highlights } from "../data/highlights";
import { checkAuth, loginAdmin, logout } from "./authAPI";
import {
  getAllHighlight,
  clearHighlight,
  createHighlight,
  deleteHighlight,
  updateHighlight,
  uploadPhotoHighlight,
} from "./highlightAPI";
import { getAllHistory, getHistoryByUser } from "./historyAPI";
import {
  getLecturers,
  createLecturer,
  deleteLecturer,
  updateLecturer,
  uploadPhotoDosen,
} from "./lecturerAPI";

import {
  adminGetAnnouncements,
  changeStatus,
  createAnnouncement,
  delAnnouncement,
  update,
  getAnnouncements,
  getById,
  updateViewCount,
  uploadImageAnnouncement,
} from "./announcement/announcementAPI";
import api from "./utils/api";

const simulateLatency = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getPartners() {
  await simulateLatency();
  return partners;
}

export async function getServices() {
  await simulateLatency();
  return services;
}

export async function getHighlights() {
  await simulateLatency();
  return highlights;
}

const getdashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllHighlight,
  getLecturers,
  getdashboardData,
  checkAuth,
  clearHighlight,
  createHighlight,
  createLecturer,
  deleteHighlight,
  deleteLecturer,
  updateHighlight,
  updateLecturer,
  uploadPhotoDosen,
  uploadPhotoHighlight,
  getHistoryByUser,
  getAllHistory,
  loginAdmin,
  logout,
  adminGetAnnouncements,
  changeStatus,
  createAnnouncement,
  delAnnouncement,
  update,
  getAnnouncements,
  getById,
  updateViewCount,
  uploadImageAnnouncement,
};
