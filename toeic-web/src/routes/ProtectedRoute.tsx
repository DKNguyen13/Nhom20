import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  guestOnly?: boolean;
  role?: "user" | "admin";
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  guestOnly = false,
  role,
  children,
}) => {
  if (!isAuthenticated && !guestOnly) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && guestOnly) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
