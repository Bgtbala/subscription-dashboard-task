import {
  LOADING_TOGGLE_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOGOUT_ACTION,
  SIGNUP_CONFIRMED_ACTION,
  SIGNUP_FAILED_ACTION,
} from "../actions/actionTypes";

const initialState = {
  user: null,
  admin:"",
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  errorMessage: "",
  successMessage: "",
  loading: false,
};

export function AuthReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN_CONFIRMED_ACTION: {
      const payload = action.payload;

      return {
        ...state,
        user: payload.user || null,     // user login
        admin: payload.admin || null,   // admin login (FIXED)
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        isAuthenticated: true,
        errorMessage: "",
        successMessage: "Login Successful",
      };
    }

    case SIGNUP_CONFIRMED_ACTION:
      return {
        ...state,
        errorMessage: "",
        successMessage: action.payload,
        loading: false,
      };

    case LOGIN_FAILED_ACTION:
    case SIGNUP_FAILED_ACTION:
      return {
        ...state,
        errorMessage: action.payload,
        successMessage: "",
        loading: false,
        isAuthenticated: false,
      };

    case LOGOUT_ACTION:
      return initialState;

    case LOADING_TOGGLE_ACTION:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

