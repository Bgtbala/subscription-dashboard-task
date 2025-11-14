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

      {/* LEFT SECTION */}
      <div className="login-aside text-center d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-5">
          <h3 className="mb-2">
            {role === "admin" ? "Admin Login" : "Welcome Back!"}
          </h3>
          <p>
            {role === "admin"
              ? "Access the admin control panel securely."
              : "Sign in to manage your account effortlessly."}
          </p>
        </div>

        <div
          className="aside-image"
          style={{
            background: "#ececec",
            borderRadius: "10px",
            height: "100%",
          }}
        ></div>
      </div>

      {/* RIGHT SECTION */}
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div id="sign-in" className="auth-form form-validation">

                  {/* ROLE SWITCH */}
                  <div className="d-flex justify-content-end mb-3">
                    <button
                      onClick={changeRole}
                      className="btn btn-sm btn-outline-primary"
                    >
                      {role === "user" ? "Switch to Admin Login" : "Switch to User Login"}
                    </button>
                  </div>

                  <form onSubmit={onLogin} className="form-validate">
                    <h3 className="text-center mb-4 text-black">
                      {role === "admin" ? "Admin Login" : "User Login"}
                    </h3>

                    {/* EMAIL */}
                    <div className="form-group mb-3">
                      <label className="mb-1">
                        <strong>Email</strong>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="form-group mb-3">
                      <label className="mb-1">
                        <strong>Password</strong>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>

                    {/* LOGIN BUTTON */}
                    <div className="text-center form-group mb-3">
                      <button type="submit" className="btn btn-primary btn-block">
                        Sign In
                      </button>
                    </div>

                    {/* REGISTER BUTTON (USER ONLY) */}
                    {role === "user" && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          onClick={() => navigate("/register")}
                          className="btn btn-outline-primary"
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
        </div>
      </div>

    </div>
  );
}

export default Login;
