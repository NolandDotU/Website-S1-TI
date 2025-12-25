import api from "./utils/api";

export async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

export async function checkAuth() {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error checking auth:", error);
  }
}

export async function loginAdmin(user) {
  try {
    const response = await api.post("/auth/admin", { ...user });
    return response.data;
  } catch (error) {
    console.error("Error logging in admin:", error);
  }
}
