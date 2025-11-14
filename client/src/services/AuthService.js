import axios from "axios";
import swal from "sweetalert";

/* -------------------- FIREBASE LOGIN / SIGNUP -------------------- */

export function signUp(email, password) {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    { email, password, returnSecureToken: true }
  );
}

export function login(email, password) {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    { email, password, returnSecureToken: true }
  );
}

/* -------------------- ERROR HANDLER -------------------- */

export function formatError(errorResponse) {
  const msg = errorResponse.error.message;

  const MESSAGES = {
    EMAIL_EXISTS: "Email already exists",
    EMAIL_NOT_FOUND: "Email not found",
    INVALID_PASSWORD: "Invalid password",
  };

  swal("Oops", MESSAGES[msg] || "Authentication failed", "error");
}

/* -------------------- LOCAL STORAGE TOKEN HANDLING -------------------- */

export function saveTokenInLocalStorage(tokenDetails) {
  tokenDetails.expireDate = new Date(
    new Date().getTime() + tokenDetails.expiresIn * 1000
  );
  localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
}

export function getStoredToken() {
  const stored = localStorage.getItem("userDetails");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearStoredToken() {
  localStorage.removeItem("userDetails");
}

/* -------------------- AUTO LOGIN (PURE FUNCTION) -------------------- */

export function checkAutoLogin() {
  const session = getStoredToken();
  if (!session) return null;

  const now = new Date();
  const expiry = new Date(session.expireDate);

  if (now >= expiry) {
    clearStoredToken();
    return null;
  }

  return session;
}
