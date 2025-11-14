import { toast } from "react-toastify";
import { registerUser } from "../../api/auth";

import {
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    LOADING_TOGGLE_ACTION,
    LOGOUT_ACTION,
} from './actionTypes';

// Simple actions
export const loadingToggleAction = (status) => ({
  type: LOADING_TOGGLE_ACTION,
  payload: status,
});

export const loginConfirmedAction = (data) => ({
  type: LOGIN_CONFIRMED_ACTION,
  payload: data,
});

export const loginFailedAction = (msg) => ({
  type: LOGIN_FAILED_ACTION,
  payload: msg,
});

// =========================
// FINAL LOGIN ACTION (NO API CALLS HERE)
// =========================
export const loginAction = (response, navigate) => {
  console.log("🚀 ~ loginAction ~ response:", response);

  return (dispatch) => {
    dispatch(loginConfirmedAction(response));
    dispatch(loadingToggleAction(false));

    toast.success("Login successful!");
    
    // correctly pick role from either .user or .admin
    const role = response?.admin?.role || response?.user?.role;
    console.log("🚀 ~ loginAction ~ role:", role)

    if (role === "admin") {
      navigate("/admin/subscriptions");   // ADMIN FLOW
    } else {
      navigate("/dashboard");             // USER FLOW
    }
  };
};


// =========================
// LOGOUT
// =========================
export const Logout = (navigate) => {
  localStorage.removeItem("userDetails");
  navigate("/login");

  return { type: LOGOUT_ACTION };
};

// ========================================
// SIGN UP ACTION
// ========================================


export const signupAction = (data, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(loadingToggleAction(true));

      await registerUser(data); // API call

      dispatch({
        type: SIGNUP_CONFIRMED_ACTION,
        payload: "Registration successful!",
      });

      dispatch(loadingToggleAction(false));

      toast.success("Registration successful!");

      // Redirect
      navigate("/login");
    } catch (error) {
      dispatch(loadingToggleAction(false));

      const msg = error.response?.data?.message || "Registration failed";

      dispatch({
        type: SIGNUP_FAILED_ACTION,
        payload: msg,
      });

      toast.error(msg);
    }
  };
};
