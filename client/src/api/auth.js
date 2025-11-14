// src/api/user.api.js
import { api } from "../utils/axios";

// ------------------------------------------
// REGISTER USER
// ------------------------------------------
export const registerUser = async (data) => {
  try {
    const response = await api.post("/user/register", data);
    return response.data?.data; // standard ApiResponse structure
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// LOGIN USER
// ------------------------------------------
export const loginUser = async (data) => {
  try {
    const response = await api.post("/user/login", data);
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// REFRESH ACCESS TOKEN
// ------------------------------------------
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post("/user/refresh", { refreshToken });
    return response.data?.data;
  } catch (err) {
    throw err;
  }
};

// ------------------------------------------
// LOGOUT USER
// ------------------------------------------
export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout");
    return response?.data?.data;
  } catch (err) {
    throw err;
  }
};
