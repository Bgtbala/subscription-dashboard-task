// src/api/admin.api.js
import { api } from "../utils/axios";

// ------------------------------------------
// ADMIN LOGIN
// ------------------------------------------
export const adminLogin = async (data) => {
  try {
    const response = await api.post("/admin/login", data);
    console.log("🚀 ~ adminLogin ~ response:", response)
    return response.data?.data; // contains { admin, accessToken, refreshToken }
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// ADMIN REFRESH TOKEN
// ------------------------------------------
export const refreshAdminToken = async (refreshToken) => {
  try {
    const response = await api.post("/admin/refresh", { refreshToken });
    return response.data?.data; // contains new access + refresh tokens
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// ADMIN LOGOUT
// ------------------------------------------
export const adminLogout = async () => {
  try {
    const response = await api.post("/admin/logout");
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};
