import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../store/store";
import { LOGOUT_ACTION } from "../store/actions/actionTypes";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

/* ----------------------------------------------------
   🛑 401 – Unauthorized Handler
---------------------------------------------------- */
const handleUnauthorizedError = (error, dispatch, navigate) => {
  console.log("❌ Unauthorized error");

  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    dispatch({ type: LOGOUT_ACTION });

    toast.error("Session expired, please log in again.");
    navigate("/login");
  }

  return Promise.reject(error);
};

/* ----------------------------------------------------
   🌐 Network Error Handler
---------------------------------------------------- */
const handleNetworkError = (error) => {
  if (error?.message === "Network Error") {
    toast.error("Network error, please try again later");
  }
  return Promise.reject(error);
};

/* ----------------------------------------------------
   ⛔ 403 – Forbidden / Validation Error
---------------------------------------------------- */
const handleAuthorizationError = (error) => {
  if (error?.response?.status === 403) {
    const messages = error?.response?.data?.data;
    if (Array.isArray(messages)) {
      messages.forEach((msg) => toast.error(msg));
    } else {
      toast.error(error?.response?.data?.message || "Validation failed");
    }
  }

  return Promise.reject(error?.response?.data);
};

/* ----------------------------------------------------
   ⚠️ Other Server Errors
---------------------------------------------------- */
const handleOtherErrors = (error) => {
  const msg = error?.response?.data?.message || "Something went wrong";
  toast.error(msg);
  return Promise.reject(error?.response?.data);
};

/* ----------------------------------------------------
   🔗 Attach Interceptors (ALWAYS attach fresh ones)
---------------------------------------------------- */
const setupInterceptors = (navigate, dispatch) => {
  // Remove old handlers every mount to avoid stale tokens
  api.interceptors.request.handlers = [];
  api.interceptors.response.handlers = [];

  /* ---------- RESPONSE INTERCEPTOR ---------- */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        return handleUnauthorizedError(error, dispatch, navigate);
      }

      if (error?.message === "Network Error") {
        return handleNetworkError(error);
      }

      if (error?.response?.status === 403) {
        return handleAuthorizationError(error);
      }

      return handleOtherErrors(error);
    }
  );

  /* ---------- REQUEST INTERCEPTOR ---------- */
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.accessToken;

      console.log("🚀 Using Token:", token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export { api, setupInterceptors };
