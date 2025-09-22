import React from "react";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default AdminRoute;
