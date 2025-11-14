import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { loadingToggleAction, signupAction } from "../../store/actions/AuthActions";

function Register(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUp = (e) => {
    e.preventDefault();

    let hasError = false;
    let temp = { name: "", email: "", password: "" };

    if (!name) {
      temp.name = "Name is required";
      hasError = true;
    }
    if (!email) {
      temp.email = "Email is required";
      hasError = true;
    }
    if (!password) {
      temp.password = "Password is required";
      hasError = true;
    }

    setErrors(temp);
    if (hasError) return;

    dispatch(loadingToggleAction(true));
    dispatch(
      signupAction(
        { name, email, password }, // 👈 send full object
        navigate
      )
    );
  };

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="auth-form">

                <h4 className="text-center mb-4">Sign up your account</h4>

                {props.errorMessage && (
                  <div className="text-danger">{props.errorMessage}</div>
                )}

                <form onSubmit={onSignUp}>

                  {/* NAME */}
                  <div className="form-group mb-3">
                    <label className="mb-1">
                      <strong>Name</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </div>

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
                      placeholder="hello@example.com"
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
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
                      placeholder="Password"
                    />
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign me up
                    </button>
                  </div>
                </form>

                <div className="new-account mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link className="text-primary" to="/login">
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Register);
