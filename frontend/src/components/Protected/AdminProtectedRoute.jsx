import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import PropTypes from "prop-types";

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
