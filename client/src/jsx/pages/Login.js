import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loadingToggleAction, loginAction } from "../../store/actions/AuthActions";
import { adminLogin } from "../../api/admin.api";
import { loginUser } from "../../api/auth";
import { toast } from "react-toastify";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login mode toggle
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123456");

  const [errors, setErrors] = useState({ email: "", password: "" });

  const changeRole = () => {
    if (role === "user") {
      setRole("admin");
      setEmail("admin@gmail.com");
      setPassword("123456");
    } else {
      setRole("user");
      setEmail("user@gmail.com");
      setPassword("123456");
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();

    let temp = { email: "", password: "" };
    let hasError = false;

    if (!email) {
      temp.email = "Email is required";
      hasError = true;
    }
    if (!password) {
      temp.password = "Password is required";
      hasError = true;
    }

    setErrors(temp);
    if (hasError) {
      toast.error("Please fill all fields");
      return;
    }

    dispatch(loadingToggleAction(true));

    try {
      let apiResponse;

      // 🔥 Correct API call for admin/user
      if (role === "admin") {
        apiResponse = await adminLogin({ email, password });
      } else {
        apiResponse = await loginUser({ email, password });
      }

      dispatch(loginAction(apiResponse, navigate));

    } catch (err) {
      dispatch(loadingToggleAction(false));

      const msg = err.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    }
  };

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">

{/* LEFT SECTION - Centered and Styled (Text kept) */}
<div className="login-aside text-center d-flex flex-column flex-row-auto justify-content-center align-items-center p-5">
  {/* The d-flex, justify-content-center, and align-items-center classes ensure the content is centered both horizontally and vertically */}
  <div className="d-flex flex-column align-items-center text-white">
    
    {/* Optional: Add a subtle visual accent (like a small icon or separator) */}
    <span className="mb-4 display-4 text-white-50">
        {role === "admin" ? "🛡️" : "✨"}
    </span>

    <div className="mb-2"> {/* Keeping the original structure's flow */}
      <h3 className="mb-2 fw-bold display-6">
        {/* Original H3 text kept */}
        {role === "admin" ? "Admin Login" : "Welcome Back!"}
      </h3>
      <p className="text-white-75 fs-5 px-3">
        {/* Original P text kept */}
        {role === "admin"
          ? "Access the admin control panel securely."
          : "Sign in to manage your account effortlessly."}
      </p>
    </div>

    {/* You can add more marketing text or a decorative element here */}
  </div>
</div>

{/* RIGHT SECTION - REFINED */}
<div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-3 p-md-5">
  <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: '450px' }}>
    <div className="card-body p-4 p-sm-5">
      <div className="d-flex justify-content-end mb-4">
        {/* ROLE SWITCH - Primary action should be visually dominant, use text for the less important switch */}
        <button
          onClick={changeRole}
          className="btn btn-sm btn-link text-decoration-none text-primary"
        >
          {role === "user" ? "Switch to Admin Login" : "Switch to User Login"}
        </button>
      </div>

      <form onSubmit={onLogin} className="form-validate">
        <h3 className="text-center mb-5 fw-bold text-dark">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h3>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="form-label fw-medium text-secondary" htmlFor="email-input">
            Email address
          </label>
          <input
            id="email-input"
            type="email"
            className="form-control form-control-lg border-0 bg-light rounded-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            aria-label="Email address"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="form-label fw-medium text-secondary" htmlFor="password-input">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            className="form-control form-control-lg border-0 bg-light rounded-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-label="Password"
            required
          />
        </div>

        {/* LOGIN BUTTON */}
        <div className="d-grid gap-2 mb-3 mt-5">
          <button type="submit" className="btn btn-primary btn-lg rounded-2 fw-bold">
            Sign In
          </button>
        </div>

        {/* REGISTER BUTTON (USER ONLY) */}
        {role === "user" && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="btn btn-outline-secondary btn-lg rounded-2 w-100"
            >
              Create an Account
            </button>
          </div>
        )}
      </form>
    </div>
  </div>
</div>

    </div>
  );
}

export default Login;
