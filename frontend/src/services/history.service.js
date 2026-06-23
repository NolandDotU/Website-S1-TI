import api from "./utils/api";

export const getAllHistory = async (
  limit = 50,
  page = 1,
  search = "",
  user,
  action = "",
  entity = "",
  dateRange = "all",
) => {
  const isAdmin = user?.role === "admin";
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (action && action !== "all") params.set("action", action);
  if (entity && entity !== "all") params.set("entity", entity);
  if (dateRange && dateRange !== "all") params.set("dateRange", dateRange);

  try {
    const endpoint = isAdmin ? "/history/" : "/history/user/";
    const response = await api.get(`${endpoint}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHistoryByUser = async () => {
  try {
    const response = await api.get("/history/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};
