import { lazy, Suspense, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";

import { checkAutoLogin } from "./services/AuthService";
import { loginConfirmedAction, Logout } from "./store/actions/AuthActions";
import { selectIsAuthenticated } from "./store/selectors/AuthSelectors";

import "bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Markup from "./jsx";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => import("./jsx/pages/Login"));

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

function App(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(() => {
  // Do nothing on mount — let Redux handle login
}, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Routes>
          {/* DEFAULT → LOGIN */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* FULL APP */}
          <Route path="/*" element={<Markup />} />
        </Routes>
      </Suspense>
    </>
  );
}

const mapStateToProps = (state) => ({
  selectIsAuthenticated: selectIsAuthenticated(state),
});

export default withRouter(connect(mapStateToProps)(App));
