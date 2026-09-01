import { Navigate, Outlet } from "react-router-dom";

const PartnerProtectedRoute = () => {
  const token = localStorage.getItem("partnerToken");

  if (!token) {
    return <Navigate to="/partner/login" replace />;
  }

  return <Outlet />;
};

export default PartnerProtectedRoute;
