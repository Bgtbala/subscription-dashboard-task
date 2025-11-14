import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUserType } from "../store/selectors/AuthSelectors";

const AdminRoute = ({ children }) => {
  const role = useSelector(selectCurrentUserType);
  console.log("🚀 ~ AdminRoute ~ role:", role)

  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
